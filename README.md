# **useQuery**:

Hook used to perform queries to an endpoint. Allows easy management of operations and query status.

It internally uses `apiInstance` which can take an absolute url or a relative one since, as specified earlier in the section on configuration, we set an `API_BASE_URL` which `apiInstance` considers its base url.

## **_Parameters:_**

| Parameter          | Type                 | Default     | Description                                                                                                     |
| ------------------ | -------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| url                | string               |             | Endpoint url                                                                                                    |
| method             | string               | GET         | Request method (GET, POST...)                                                                                   |
| executeImmediately | boolean              | false       | Sets whether the call should be executed when the component is created or wait for the call to `executeQuery()` |
| onSuccess          | `(response) => void` | `() => { }` | Function executed after a successful query                                                                      |
| onUnauthorized     | `(response) => void` | `() => { }` | Function executed after an unsuccessful query if the response code is 401                                       |
| onError            | `(response) => void` | `() => { }` | Function executed after an unsuccessful query if the response code is not 401                                   |

## **_Returned parameters:_**

| Parameter    | Type                  | Description                                                                                 |
| ------------ | --------------------- | ------------------------------------------------------------------------------------------- |
| isLoading    | boolean               | `true` while the query is being executed, `false` otherwise, even if it has not yet started |
| isError      | boolean               | `true` while the query finished unsuccessfully, `false` otherwise                           |
| isSuccess    | boolean               | `true` while the query finished successfully, `false` otherwise                             |
| data         | any                   | The query response if it finished successfully, `undefined` otherwise                       |
| error        | any                   | The query response if it finished unsuccessfully, `undefined` otherwise                     |
| executeQuery | `(data?: {}) => void` | Trigger the query with optional body as parameter                                           |

## **_Example 1:_**

```javascript
const { isLoading, executeQuery } = useQuery({
  url: "api/v1/accounts/login/",
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

## **_Example 2:_**

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
