import { useReducer, useEffect, useRef, useContext, useState } from "react"
import { ApiProviderContext } from "../context/apiProviderContext"
import { Status, generateApiClient } from "../utils"
import {
  UseQueryProps,
  ApiProviderContextData,
  QueryState,
  QueryActions,
  UseQueryReturn,
  SetQueryParams,
} from "../types"

export const useQuery = ({
  url,
  method = "GET",
  executeImmediately = false,
  onSuccess: _onSuccess,
  onError: _onError,
  onUnauthorized: _onUnauthorized,
  clientOptions = {},
  apiClient,
  queryParams: defaultQueryParams = {},
}: UseQueryProps): UseQueryReturn => {
  //*******************************************
  // States
  //*******************************************
  const {
    apiClient: contextApiClient,
    onUnauthorized: contextOnUnauthorized,
    onError: contextOnError,
    onSuccess: contextOnSuccess,
  }: ApiProviderContextData = useContext(ApiProviderContext)

  const requestId = useRef<string | null>(null)

  const [queryParams, setQueryParamsState] = useState(defaultQueryParams)

  //*******************************************
  // Variables
  //*******************************************

  const _apiClient = apiClient || contextApiClient || generateApiClient({})

  const onSuccess = _onSuccess !== undefined ? _onSuccess : contextOnSuccess
  const onError = _onError !== undefined ? _onError : contextOnError
  const onUnauthorized =
    _onUnauthorized !== undefined ? _onUnauthorized : contextOnUnauthorized

  //*******************************************
  // Reducer
  //*******************************************
  const queryReducer = (state: QueryState, action: QueryActions) => {
    switch (action.status) {
      case Status.LOADING:
        return {
          status: action.status,
          response: undefined,
          error: undefined,
        }
      case Status.SUCCESS:
        return {
          status: action.status,
          response: action.payload,
          error: undefined,
        }
      case Status.ERROR:
        return {
          status: action.status,
          response: undefined,
          error: action.payload,
        }
      case Status.IDLE:
        return {
          status: action.status,
          response: undefined,
          error: undefined,
        }
      default:
        throw new Error("Invalid action")
    }
  }

  const [state, dispatch] = useReducer(queryReducer, {
    response: undefined,
    error: undefined,
    status: executeImmediately ? Status.LOADING : Status.IDLE,
  })

  //*******************************************
  // Query logic
  //*******************************************
  const executeQuery = (data?: any, params?: any) => {
    if (!_apiClient) throw new Error("apiClient is not defined")

    // Use the queryId to make sure that the response is for the latest query
    const queryId = Math.random().toString(36).substring(7)
    requestId.current = queryId

    if (url === undefined || url === null) {
      dispatch({ status: Status.IDLE })
      return
    }

    dispatch({ status: Status.LOADING })

    const cleanQueryParams = Object.entries(queryParams).reduce<
      Record<string, string>
    >((acc, [key, value]) => {
      if (value !== null) {
        acc[key] = value
      }
      return acc
    }, {})

    _apiClient({
      url: url,
      method: method,
      data: data,
      params: params || cleanQueryParams,
      ...clientOptions,
    })
      .then((response) => {
        if (requestId.current !== queryId) return

        dispatch({ status: Status.SUCCESS, payload: response })
        try {
          if (onSuccess) onSuccess(response)
        } catch (e) {
          console.error(e)
        }
      })
      .catch((error) => {
        if (requestId.current !== queryId) return

        dispatch({ status: Status.ERROR, payload: error })

        if (error.response && error.response.status === 401 && onUnauthorized) {
          onUnauthorized(error)
        } else {
          if (onError) onError(error)
        }
      })
  }

  const resetQuery = () => {
    requestId.current = null
    dispatch({ status: Status.IDLE })
  }

  const setQueryParams: SetQueryParams = (
    params,
    options = { runQuery: false }
  ) => {
    // If executeImmediately is true, just update the state, the useEffect will take care of executing the query.
    // Otherwise, call the executeQuery function.
    setQueryParamsState(params)
    if (options.runQuery && !executeImmediately) executeQuery(undefined, params)
  }

  useEffect(() => {
    if (executeImmediately) executeQuery()
  }, [url, executeImmediately, queryParams])

  return {
    isLoading: state.status === Status.LOADING,
    isError: state.status === Status.ERROR,
    isSuccess: state.status === Status.SUCCESS,
    status: state.status,
    response: state.response,
    error: state.error,
    data: state.status === Status.SUCCESS ? state.response.data : undefined,
    executeQuery: executeQuery,
    resetQuery: resetQuery,
    queryParams: queryParams,
    setQueryParams,
  }
}
