import { AxiosRequestConfig } from "axios";

export type UseQueryProps = {
  url: string;
  method: string;
  executeImmediately: boolean;
  onSuccess: any; //TODO
  onError: any; //TODO
  onUnauthorized: any; //TODO
  clientOptions: AxiosRequestConfig;
};
