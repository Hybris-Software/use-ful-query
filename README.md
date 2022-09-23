# useQuery

- [Introduction](#introduction)
- [Installation](#installation)
- [useQuery](#usequery-1)
  - [Parameters](#parameters)
  - [Returned parameters](#returned-parameters)
- [generateApiClient](#generateapiclient)
  - [Parameters](#parameters-1)
- [Examples](#examples)
  - [Example 1](#example-1)
  - [Example 2](#example-2)

## Introduction

Hook used to perform queries to an endpoint. Allows easy management of operations and query status.

It requires an Axios client. This library already provides the `generateApiClient` function which returns a client with a variable base url and an interceptor to send an authentication header. You may also create an axios client by your own.

## Installation

Install the library with `npm install @hybris-software/use-query`.

At the upper level of the application you should insert the `ApiProvider` with an api client as in the example below:

```javascript
import { generateApiClient, ApiProvider } from "@hybris-software/use-query";
...
const apiClient = generateApiClient({
  baseUrl: "https://my.api.com/api/v1",
  authorizationHeader: "Authorization",
  authorizationPrefix: "Bearer"
})
...
root.render(
  <React.StrictMode>
    <ApiProvider apiClient={apiClient}>
      <App />
    </ApiProvider>
  </React.StrictMode >
);
```

## useQuery

### Parameters

| Parameter          | Type                 | Default     | Description                                                                                                     |
| ------------------ | -------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| url                | string               |             | Endpoint url                                                                                                    |
| method             | string               | GET         | Request method (GET, POST...)                                                                                   |
| executeImmediately | boolean              | false       | Sets whether the call should be executed when the component is created or wait for the call to `executeQuery()` |
| onSuccess          | `(response) => void` | `() => { }` | Function executed after a successful query                                                                      |
| onUnauthorized     | `(response) => void` | `() => { }` | Function executed after an unsuccessful query if the response code is 401                                       |
| onError            | `(response) => void` | `() => { }` | Function executed after an unsuccessful query if the response code is not 401                                   |

### Returned parameters

| Parameter    | Type                  | Description                                                                                 |
| ------------ | --------------------- | ------------------------------------------------------------------------------------------- |
| isLoading    | boolean               | `true` while the query is being executed, `false` otherwise, even if it has not yet started |
| isError      | boolean               | `true` while the query finished unsuccessfully, `false` otherwise                           |
| isSuccess    | boolean               | `true` while the query finished successfully, `false` otherwise                             |
| data         | any                   | The query response if it finished successfully, `undefined` otherwise                       |
| error        | any                   | The query response if it finished unsuccessfully, `undefined` otherwise                     |
| executeQuery | `(data?: {}) => void` | Trigger the query with optional body as parameter                                           |

## generateApiClient

This function returns an Axios client with the possibility to set a `baseUrl`, and an authorization header. It gets the authorization token from `localStorage` or `sessionStorage` with the key `token`.

### Parameters

| Parameter           | Type   | Default         | Description                                                                                       |
| ------------------- | ------ | --------------- | ------------------------------------------------------------------------------------------------- |
| baseUrl             | string |                 | Axios base url                                                                                    |
| authorizationHeader | string | "Authorization" | Authorization header name                                                                         |
| authorizationPrefix | string | "Bearer"        | The authorization header prefix, for example `Authorization: Bearer your_token_from_localstorage` |

### Our api client

This is what `generateApiClient` generates, you can use it as a base to create your own api client.

```javascript
const apiClient = axios.create({
  baseURL: baseUrl,
});

apiClient.interceptors.request.use(
  function (config) {
    config.headers = config.headers || {};
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers[authorizationHeader] = `${authorizationPrefix} ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
```

## Examples

### Example 1

```javascript
const { isLoading, executeQuery } = useQuery({
  url: "accounts/login/", // If baseUrl has been set, you can use a relative url. It also accepts absolute urls.
  method: "POST",
  executeImmediately: false,
  onSuccess: (response) => {
    console.log(response);
  },
  onUnauthorized: (response) => {
    console.log(response);
  },
});

const submitForm(value) => {
  executeQuery(value);
}

if(isLoading)
  return <Loader />
else
  return <Form submitForm={submitForm} />
```

### Example 2

```javascript
const { isLoading, isSuccess, data, error } = useQuery({
  url: "api/v1/userinfo/",
  method: "GET",
  executeImmediately: true,
});

if (isLoading) return <Loader />;
else if (isSuccess) return <UserInfo data={data} />;
else return <Error error={error} />;
```
