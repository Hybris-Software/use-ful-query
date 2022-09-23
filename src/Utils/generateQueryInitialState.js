import { status } from "./constants";

const generateQueryInitialState = (executeImmediately) => {
  const initialState = {
    response: undefined,
    error: undefined,
    status: executeImmediately ? status.LOADING : status.IDLE,
  };
  return initialState;
};

export default generateQueryInitialState;
