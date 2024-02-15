import { useReducer, useEffect, useRef, useContext } from "react";
import { ApiProviderContext } from "../context/apiProviderContext";
import { Status, Actions } from "../utils/constants";
import { generateQueryInitialState } from "../utils/states";
import { UseQueryProps, ApiProviderContextData } from "../types";

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
  const cancelRequest = useRef(false);

  //*******************************************
  // Reducer
  //*******************************************
  const queryReducer = (state: any, action: any) => {
    switch (action.status) {
      case Status.LOADING:
        return {
          ...generateQueryInitialState(executeImmediately),
          status: Status.LOADING,
        };
      case Status.SUCCESS:
        return {
          ...generateQueryInitialState(executeImmediately),
          status: Status.SUCCESS,
          response: action.payload,
        };
      case Status.ERROR:
        return {
          ...generateQueryInitialState(executeImmediately),
          status: Status.ERROR,
          error: action.payload,
        };
      case Actions.RESET:
        return generateQueryInitialState(executeImmediately);
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(
    queryReducer,
    generateQueryInitialState(executeImmediately)
  );

  //*******************************************
  // Query logic
  //*******************************************
  const executeQuery = (data = {}, params = {}) => {
    if (!apiClient) throw new Error("apiClient is not defined");

    cancelRequest.current = false;
    dispatch({ status: Status.LOADING });

    apiClient({
      url: url,
      method: method,
      data: data,
      params: params,
      ...clientOptions,
    })
      .then((response) => {
        if (cancelRequest.current) return;

        dispatch({ status: Status.SUCCESS, payload: response });
        try {
          onSuccess(response);
        } catch (e) {
          console.error(e);
        }
      })
      .catch((error) => {
        if (cancelRequest.current) return;

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

  const resetQuery = () => {
    dispatch({ status: Actions.RESET });
  };

  useEffect(() => {
    if (executeImmediately) executeQuery();
    return () => {
      cancelRequest.current = true;
    };
  }, [url]);

  return {
    isLoading: state.status === Status.LOADING,
    isError: state.status === Status.ERROR,
    isSuccess: state.status === Status.SUCCESS,
    response: state.response,
    error: state.error,
    executeQuery: executeQuery,
    resetQuery: resetQuery,
  };
};
