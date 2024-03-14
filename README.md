# use-ful-query

- [Introduction](#1-Introduction)
- [Installation](#2-Installation)
- [Configuration](#3-Configuration)
- [generateApiClient](#4-generateApiClient)
  - [Parameters](#4.1-Parameters)
- [useQuery](#5-useQuery)
  - [Parameters](#5.1-Parameters)
  - [Returned values](#5.2-Returnedvalues)
- [ApiProvider](#6-ApiProvider)
  - [Parameters](#6.1-Parameters)

## 1 - Introduction

This hook can be used to perform queries to an endpoint. Facilitates easy management of operations and tracks query status.

It requires an Axios client. This library already provides the `generateApiClient` function which returns a client with a variable base url and an interceptor to send an authentication header. You may also create an axios client by your own.

## 2 - Installation

Install the library with `npm install @hybris-software/use-ful-query`.

## 3 - Configuration

In case you want to use some default parameters you can use a context instead of passing the parameter in every query. It is not required but highly recommended.

At the top level of the application, insert the `ApiProvider` component and pass the default props as explained in the section below.

In this example, if you want to use the same API client throughout the project, you need to generate an `axios` client (either on your own or using the `generateApiClient` helper function) and pass it to the `ApiProvider` through the `apiClient` property.

```typescript
import { generateApiClient, ApiProvider } from "@hybris-software/use-ful-query";
...
const apiClient = generateApiClient({
  baseUrl: "https://my.api.com/api/v1",
  authorizationHeader: "Authorization",
  authorizationPrefix: "Bearer "
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

## 4 - generateApiClient

This function returns an Axios client with the possibility to set a `baseUrl`, and an authorization header. It gets the authorization token from `localStorage` or `sessionStorage` with the key `token`.

### 4.1 - Parameters

| Parameter           | Type              | Default         | Description                                                                                       |
| ------------------- | ----------------- | --------------- | ------------------------------------------------------------------------------------------------- |
| baseUrl             | string (optional) |                 | Axios base url                                                                                    |
| timeout             | number (optional) | 5000            | Default query timeout (milliseconds)                                                              |
| authorizationHeader | string (optional) | "Authorization" | Authorization header name                                                                         |
| authorizationPrefix | string (optional) | "Bearer "       | The authorization header prefix, for example `Authorization: Bearer your_token_from_localstorage` |
| localStorageKey     | string (optional) | "token"         | Local storage key that contains the authentication token                                          |

## 5 - useQuery

### 5.1 - Parameters

| Parameter          | Type                                              | Default | Description                                                                                                                                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url                | string (optional)                                 |         | Endpoint url. If the value is null, the query will not be executed.                                                                                                                                                                                                                                                                                         |
| method             | string (optional)                                 | 'GET'   | Request method (GET, POST...)                                                                                                                                                                                                                                                                                                                               |
| executeImmediately | boolean (optional)                                | false   | Sets whether the call should be executed when the component gets mounted or wait for the call to `executeQuery()`                                                                                                                                                                                                                                           |
| onSuccess          | `(response: AxiosResponse) => void` (optional)    |         | Function executed after a successful query. The default function is the one defined in the `ApiProvider` if it is not specified in `useQuery`. To disable the default one and not use an `onSuccess` set `onSuccess=null`                                                                                                                                   |
| onUnauthorized     | `(error: AxiosError) => void` (optional)          |         | Function executed after an unsuccessful query if the response code is 401. If this function is not defined, the error will be handled by the generic `onError` one. The default function is the one defined in the `ApiProvider` if it is not specified in `useQuery`. To disable the default one and not use an `onUnauthorized` set `onUnauthorized=null` |
| onError            | `(error: Error \| AxiosError) => void` (optional) |         | Function executed after an unsuccessful query. If `onUnauthorized` is not defined, it also handles 401 status code. The default function is the one defined in the `ApiProvider` if it is not specified in `useQuery`. To disable the default one and not use an `onError` set `onError=null`                                                               |
| clientOptions      | object (optional)                                 |         | Extra Axios query options, ex. `{timeout: 1000}`                                                                                                                                                                                                                                                                                                            |
| apiClient          | AxiosInstance (optional)                          |         | The Axios client that will be used to call the API. By default is the one specified in the context but can be overwritten by adding `apiClient` to `useQuery`. It is also useful if the context does not exist at all.                                                                                                                                      |

### 5.2 - Returned values

| Parameter    | Type                                 | Description                                                                                                                                                         |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isLoading    | boolean                              | `true` while the query is being executed, `false` otherwise, even if it has not yet started                                                                         |
| isError      | boolean                              | `true` while the query finished unsuccessfully, `false` otherwise                                                                                                   |
| isSuccess    | boolean                              | `true` while the query finished successfully, `false` otherwise                                                                                                     |
| status       | Status (string)                      | `idle \| loading \| success \| error`                                                                                                                               |
| response     | any \| undefined                     | The query response if it finished successfully, `undefined` otherwise                                                                                               |
| error        | Error \| AxiosError \| undefined     | The generated error if the query finished unsuccessfully, `undefined` otherwise. If it got a response, it can be accessed via `error.response`                      |
| data         | any \| undefined                     | If the query finished successfully, it will contain the data of the response. Is like response.date                                                                 |
| executeQuery | `(data?: any, params?: any) => void` | Function to trigger the query. The first argument is the data that will be sent in the body whereas the second parameter is used to add query parameters in the URL |
| resetQuery   | `() => void`                         |                                                                                                                                                                     |

## 6 - ApiProvider

This global provider allows to set some default parameters for the `useQuery` hook.

### 6.1 - Parameters

All the parameters can be overriden in the `useQuery` hook.

| Parameter      | Type                                              | Description                                                               |
| -------------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| apiClient      | AxiosInstance (optional)                          | The Axios client that will be used to call the API                        |
| onSuccess      | `(response: AxiosResponse) => void` (optional)    | Function executed after a successful query                                |
| onUnauthorized | `(error: AxiosError) => void` (optional)          | Function executed after an unsuccessful query if the response code is 401 |
| onError        | `(error: Error \| AxiosError) => void` (optional) | Function executed after an unsuccessful query                             |
