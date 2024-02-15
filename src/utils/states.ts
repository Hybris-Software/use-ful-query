import { Status } from "./constants";
import { TQueryState } from "../types";

export const generateQueryInitialState = (
  executeImmediately: boolean
): TQueryState => {
  const initialState = {
    response: undefined,
    error: undefined,
    status: executeImmediately ? Status.LOADING : Status.IDLE,
  };
  return initialState;
};
