import { useReducer, useEffect, useRef, useContext, useState } from "react";
import ApiProviderContext from "../Context/ApiProviderContext";
import { status } from "../Utils/constants";
import generateQueryInitialState from "../Utils/generateQueryInitialState";

const useMultipleQueries = ({
  queries,
  executeImmediately = false,
  onEnd = () => {},
}) => {
  //*******************************************
  // States
  //*******************************************
  const apiClient = useContext(ApiProviderContext);
  const cancelRequest = useRef(false);
  const [isLoading, setIsLoading] = useState(executeImmediately);

  //*******************************************
  // Reducer
  //*******************************************
  const checkIsLoading = (state) => {
    if (
      Object.values(state).some(
        (queryState) => queryState.status === status.LOADING
      )
    ) {
      return true;
    }
    return false;
  };

  const queryReducer = (state, action) => {
    switch (action.status) {
      case status.LOADING:
        for (const queryName in queries) {
          state[queryName].status = status.LOADING;
        }
        setIsLoading(true);
        return state;
      case status.SUCCESS:
        state[action.queryName] = {
          status: status.SUCCESS,
          response: action.payload,
          error: undefined,
        };
        setIsLoading(checkIsLoading(state));
        return state;
      case status.ERROR:
        state[action.queryName] = {
          status: status.ERROR,
          response: undefined,
          error: action.payload,
        };
        setIsLoading(checkIsLoading(state));
        return state;
      default:
        return state;
    }
  };

  const generateInitialState = () => {
    const output = {};
    for (const queryName in queries) {
      output[queryName] = generateQueryInitialState(executeImmediately);
    }
    return output;
  };

  const [queriesState, dispatch] = useReducer(
    queryReducer,
    generateInitialState(queries)
  );

  //*******************************************
  // Output generation
  //*******************************************
  const retrieveErrors = () => {
    const output = {};
    for (const [queryName, queryState] of Object.entries(queriesState)) {
      if (queryState.status === status.ERROR) {
        output[queryName] = queryState.error;
      }
    }
    return output;
  };

  const retrieveResponses = () => {
    const output = {};
    for (const [queryName, queryState] of Object.entries(queriesState)) {
      if (queryState.status === status.SUCCESS) {
        output[queryName] = queryState.response;
      }
    }
    return output;
  };

  const retrieveStatuses = () => {
    const output = {};
    for (const [queryName, queryState] of Object.entries(queriesState)) {
      output[queryName] = queryState.status;
    }
    return output;
  };

  //*******************************************
  // Query logic
  //*******************************************
  const executeQueries = (data = {}) => {
    cancelRequest.current = false;

    dispatch({ status: status.LOADING });

    for (const [queryName, queryOptions] of Object.entries(queries)) {
      apiClient({
        url: queryOptions.url,
        method: queryOptions.method || "GET",
        data: queryName in data ? data[queryName] : queryOptions.data,
      })
        .then((response) => {
          if (cancelRequest.current) return;

          dispatch({
            queryName: queryName,
            status: status.SUCCESS,
            payload: response,
          });

          if ("onSuccess" in queryOptions) {
            queryOptions.onSuccess(response);
          }
        })
        .catch((error) => {
          if (cancelRequest.current) return;

          dispatch({
            queryName: queryName,
            status: status.ERROR,
            payload: error,
          });

          if (
            error.response &&
            error.response.status === 401 &&
            queryOptions.onUnauthorized
          ) {
            queryOptions.onUnauthorized(error);
          } else if (queryOptions.onError) {
            queryOptions.onError(error);
          }
        });
    }
  };

  useEffect(() => {
    if (executeImmediately) executeQueries();
    return () => {
      cancelRequest.current = true;
    };
  }, []);

  useEffect(() => {
    if (
      Object.values(queriesState).some(
        (queryState) =>
          queryState.status !== status.SUCCESS &&
          queryState.status !== status.ERROR
      )
    ) {
      return;
    }

    onEnd(queriesState);
  }, [isLoading]);

  return {
    executeQueries,
    errors: retrieveErrors(),
    responses: retrieveResponses(),
    statuses: retrieveStatuses(),
    isLoading: isLoading,
    queries: queriesState,
  };
};

export default useMultipleQueries;
