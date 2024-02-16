import { useReducer, useEffect, useRef, useContext } from "react";
import { ApiProviderContext } from "../context/apiProviderContext";
import { Status } from "../utils/constants";
import {
  UseQueryProps,
  ApiProviderContextData,
  QueryState,
  QueryActions,
} from "../types";

export const useQuery = ({
  url,
  method = "GET",
  executeImmediately = false,
  onSuccess = () => {},
  onError = () => {},
  onUnauthorized = undefined,
  clientOptions = {},
}: UseQueryProps) => {
  //*******************************************
  // States
  //*******************************************
  const {
    apiClient,
    onUnauthorized: defaultOnUnauthorized,
  }: ApiProviderContextData = useContext(ApiProviderContext);
  const requestId = useRef<string | null>(null);

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
        };
      case Status.SUCCESS:
        return {
          status: action.status,
          response: action.payload,
          error: undefined,
        };
      case Status.ERROR:
        return {
          status: action.status,
          response: undefined,
          error: action.payload,
        };
      case Status.IDLE:
        return {
          status: action.status,
          response: undefined,
          error: undefined,
        };
      default:
        throw new Error("Invalid action");
    }
  };

  const [state, dispatch] = useReducer(queryReducer, {
    response: undefined,
    error: undefined,
    status: executeImmediately ? Status.LOADING : Status.IDLE,
  });

  //*******************************************
  // Query logic
  //*******************************************
  const _executeQuery = (url: string, data: any, params: any) => {
    if (!apiClient) throw new Error("apiClient is not defined");

    // Use the queryId to make sure that the response is for the latest query
    const queryId = Math.random().toString(36).substring(7);
    requestId.current = queryId;

    dispatch({ status: Status.LOADING });

    apiClient({
      url: url,
      method: method,
      data: data,
      params: params,
      ...clientOptions,
    })
      .then((response) => {
        if (requestId.current !== queryId) return;

        dispatch({ status: Status.SUCCESS, payload: response });
        try {
          onSuccess(response);
        } catch (e) {
          console.error(e);
        }
      })
      .catch((error) => {
        if (requestId.current !== queryId) return;

        dispatch({ status: Status.ERROR, payload: error });

        const onUnauthorizedFunction =
          onUnauthorized !== undefined ? onUnauthorized : defaultOnUnauthorized;

        if (
          error.response &&
          error.response.status === 401 &&
          onUnauthorizedFunction
        ) {
          onUnauthorizedFunction(error);
        } else {
          onError(error);
        }
      });
  };

  const executeQuery = (data = {}, params = {}) => {
    return _executeQuery(url, data, params);
  };

  const resetQuery = () => {
    requestId.current = null;
    dispatch({ status: Status.IDLE });
  };

  useEffect(() => {
    if (executeImmediately) _executeQuery(url, {}, {});
  }, [url]);

  return {
    isLoading: state.status === Status.LOADING,
    isError: state.status === Status.ERROR,
    isSuccess: state.status === Status.SUCCESS,
    response: state.response,
    error: state.error,
    data: state.status === Status.SUCCESS ? state.response.data : undefined,
    executeQuery: executeQuery,
    resetQuery: resetQuery,
  };
};
