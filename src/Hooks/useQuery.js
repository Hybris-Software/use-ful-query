import { useReducer, useEffect, useRef, useContext } from "react";
import ApiProviderContext from "../Context/ApiProviderContext";
import { status } from "../Utils/constants";
import generateQueryInitialState from "../Utils/generateQueryInitialState";

const useQuery = ({
  url,
  method = "GET",
  executeImmediately = false,
  onSuccess = () => {},
  onError = () => {},
  onUnauthorized = undefined,
}) => {
  //*******************************************
  // States
  //*******************************************
  const apiClient = useContext(ApiProviderContext);
  const cancelRequest = useRef(false);

  //*******************************************
  // Reducer
  //*******************************************
  const queryReducer = (state, action) => {
    switch (action.status) {
      case status.LOADING:
        return {
          ...generateQueryInitialState(executeImmediately),
          status: status.LOADING,
        };
      case status.SUCCESS:
        return {
          ...generateQueryInitialState(executeImmediately),
          status: status.SUCCESS,
          response: action.payload,
        };
      case status.ERROR:
        return {
          ...generateQueryInitialState(executeImmediately),
          status: status.ERROR,
          error: action.payload,
        };
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
  const executeQuery = (data = {}) => {
    cancelRequest.current = false;
    dispatch({ status: status.LOADING });

    apiClient({ url: url, method: method, data: data })
      .then((response) => {
        if (cancelRequest.current) return;

        dispatch({ status: status.SUCCESS, payload: response });
        onSuccess(response);
      })
      .catch((error) => {
        if (cancelRequest.current) return;

        dispatch({ status: status.ERROR, payload: error });
        if (
          error.response &&
          error.response.status === 401 &&
          onUnauthorized !== undefined
        ) {
          onUnauthorized(error);
        } else {
          onError(error);
        }
      });
  };

  useEffect(() => {
    if (executeImmediately) executeQuery();
    return () => {
      cancelRequest.current = true;
    };
  }, [url]);

  return {
    isLoading: state.status === status.LOADING,
    isError: state.status === status.ERROR,
    isSuccess: state.status === status.SUCCESS,
    response: state.response,
    error: state.error,
    executeQuery: executeQuery,
  };
};

export default useQuery;
