import { useReducer, useEffect, useRef, useContext } from "react"
import { ApiProviderContext } from "../context/apiProviderContext"
import { Status, generateApiClient } from "../utils"
import {
  UseQueryProps,
  ApiProviderContextData,
  QueryState,
  QueryActions,
  UseQueryReturn,
} from "../types"

export const useQuery = ({
  url,
  method = "GET",
  executeImmediately = false,
  onSuccess: _onSuccess = () => {},
  onError: _onError = () => {},
  onUnauthorized: _onUnauthorized = undefined,
  clientOptions = {},
  apiClient,
}: UseQueryProps): UseQueryReturn => {
  //*******************************************
  // States
  //*******************************************
  const {
    apiClient: contextApiClient,
    onUnauthorized: defaultOnUnauthorized,
    onError: defaultOnError,
    onSuccess: defaultOnSuccess,
  }: ApiProviderContextData = useContext(ApiProviderContext)

  const requestId = useRef<string | null>(null)

  //*******************************************
  // Variables
  //*******************************************

  const _apiClient = apiClient || contextApiClient || generateApiClient({})

  const onSuccess = _onSuccess || defaultOnSuccess
  const onError = _onError || defaultOnError
  const onUnauthorized = _onUnauthorized || defaultOnUnauthorized

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
  const _executeQuery = (
    url: string | null | undefined,
    data: any,
    params: any
  ) => {
    if (!_apiClient) throw new Error("apiClient is not defined")

    // Use the queryId to make sure that the response is for the latest query
    const queryId = Math.random().toString(36).substring(7)
    requestId.current = queryId

    if (url === undefined || url === null) {
      dispatch({ status: Status.IDLE })
      return
    }

    dispatch({ status: Status.LOADING })

    _apiClient({
      url: url,
      method: method,
      data: data,
      params: params,
      ...clientOptions,
    })
      .then((response) => {
        if (requestId.current !== queryId) return

        dispatch({ status: Status.SUCCESS, payload: response })
        try {
          onSuccess(response)
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
          onError(error)
        }
      })
  }

  const executeQuery = (data = {}, params = {}) => {
    return _executeQuery(url, data, params)
  }

  const resetQuery = () => {
    requestId.current = null
    dispatch({ status: Status.IDLE })
  }

  useEffect(() => {
    if (executeImmediately) _executeQuery(url, {}, {})
  }, [url])

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
  }
}
