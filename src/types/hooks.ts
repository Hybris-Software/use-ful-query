import { AxiosInstance, AxiosRequestConfig } from "axios"

export type UseQueryProps = {
  url?: string
  method?: string
  executeImmediately?: boolean
  onSuccess?: any //TODO
  onError?: any //TODO
  onUnauthorized?: any //TODO
  clientOptions?: AxiosRequestConfig
  apiClient?: AxiosInstance
}

export type QueryState = {
  status: string
  response?: any
  error?: any
}

export type QueryActions = {
  status: string
  payload?: any
}
