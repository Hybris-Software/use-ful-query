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

## 1 - Introduction

This hook can be used to perform queries to an endpoint. Allows easy management of operations and query status.

It requires an Axios client. This library already provides the `generateApiClient` function which returns a client with a variable base url and an interceptor to send an authentication header. You may also create an axios client by your own.

## 2 - Installation

Install the library with `npm install @hybris-software/use-query`.

At the upper level of the application you should also insert the `ApiProvider` component which requires an `apiClient` prop. It should be an Axios client which you can create by your own or use `generateApiClient` to generate one.

Here is an example:

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

## 3 - generateApiClient

This function returns an Axios client with the possibility to set a `baseUrl`, and an authorization header. It gets the authorization token from `localStorage` or `sessionStorage` with the key `token`.

### 3.1 - Parameters

| Parameter           | Type   | Default         | Description                                                                                       |
| ------------------- | ------ | --------------- | ------------------------------------------------------------------------------------------------- |
| baseUrl             | string |                 | Axios base url                                                                                    |
| authorizationHeader | string | "Authorization" | Authorization header name                                                                         |
| authorizationPrefix | string | "Bearer"        | The authorization header prefix, for example `Authorization: Bearer your_token_from_localstorage` |

### 3.2 - Our api client

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

## 4 - useQuery

This hook performs only one query, if you have to perform multiple queries in parallel you can call multiple times `useQuery` or use `useMultipleQueries` as described below.

### 4.1 - Parameters

| Parameter          | Type                 | Default     | Description                                                                                                        |
| ------------------ | -------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| url                | string               |             | Endpoint url                                                                                                       |
| method             | string               | 'GET'       | Request method (GET, POST...)                                                                                      |
| executeImmediately | boolean              | false       | Sets whether the call should be executed when the component is created or wait for the call to `executeQuery()`    |
| onSuccess          | `(response) => void` | `() => { }` | Function executed after a successful query                                                                         |
| onUnauthorized     | `(error) => void`    | undefined   | Function executed after an unsuccessful query if the response code is 401 (optional, see `onError`)                |
| onError            | `(error) => void`    | `() => { }` | Function executed after an unsuccessful query. If `onUnauthorized` is not defined, it also handles 401 status code |

### 4.2 - Returned parameters

| Parameter    | Type                  | Description                                                                                                                                    |
| ------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| isLoading    | boolean               | `true` while the query is being executed, `false` otherwise, even if it has not yet started                                                    |
| isError      | boolean               | `true` while the query finished unsuccessfully, `false` otherwise                                                                              |
| isSuccess    | boolean               | `true` while the query finished successfully, `false` otherwise                                                                                |
| response     | any                   | The query response if it finished successfully, `undefined` otherwise                                                                          |
| error        | any                   | The generated error if the query finished unsuccessfully, `undefined` otherwise. If it got a response, it can be accessed via `error.response` |
| executeQuery | `(data?: {}) => void` | Trigger the query with optional body as parameter                                                                                              |

## 5 - useMultipleQueries

This hooks allows to perform multiple queries in parallel with a syntax similar to that of `useQuery`.

### 5.1 - Parameters

| Parameter          | Type                 | Default     | Description                                                                                                        |
| ------------------ | -------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| queries            | object               |             | Object where the key is the name of the query. The content variables are described below.                          |
| -- url             | string               |             | Endpoint url                                                                                                       |
| -- method          | string               | 'GET'       | Request method (GET, POST...)                                                                                      |
| -- data            | object               | { }         | Request body                                                                                                       |
| -- onSuccess       | `(response) => void` |             | Function executed after a successful query                                                                         |
| -- onUnauthorized  | `(error) => void`    |             | Function executed after an unsuccessful query if the response code is 401 (optional, see `onError`)                |
| -- onError         | `(error) => void`    |             | Function executed after an unsuccessful query. If `onUnauthorized` is not defined, it also handles 401 status code |
| executeImmediately | boolean              | false       | Sets whether the call should be executed when the component is created or wait for the call to `executeQueries()`  |
| onEnd              | `(response) => void` | `() => { }` | Function executed after after all the queries finished                                                             |

### 5.2 - Returned parameters

| Parameter      | Type                  | Description                                                                                                                                                 |
| -------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| executeQueries | `(data?: {}) => void` | Start the queries with optional body as parameter. `data` should be an object where the key is the name of the query and the value is the actual query data |
| errors         | object                | Object containing all the received errors. The key is the name of the query, the value is the error                                                         |
| responses      | object                | Object containing all the received successful responses. The key is the name of the query, the value is the response                                        |
| statuses       | object                | Object containing the status of each query. The key is the name of the query, the value is the status                                                       |
| isLoading      | boolean               | `true` if any calls are in progress, `false` otherwise, even if it has not yet started                                                                      |
| queries        | object                | Contains all the information of each query. The key is the name of the query, the value is an object with the following queries: `status, error, response`  |

## 6 - Examples

### 6.1 - Example 1

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

### 6.2 - Example 2

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

### 6.3 - Example with useMultipleQueries

```javascript
const { queries } = useMultipleQueries({
  queries: {
    query1: {
      url: "https://jsonplaceholder.typicode.com/todos/1",
      onSuccess: (response) => {
        console.log("query1", response);
      },
    },
    query2: {
      url: "https://jsonplaceholder.typicode.com/todos/2",
      onError: (error) => {
        console.log("query2 error", error);
      },
      onSuccess: (response) => {
        console.log("query2 success", response);
      },
    },
    query3: {
      url: "https://wrongdomain/todos/3",
      onError: (error) => {
        console.log("query3", error);
      },
    },
  },
  executeImmediately: true,
  onEnd: () => {
    console.log("All done");
  },
});
```
