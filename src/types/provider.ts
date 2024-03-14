import React from "react"
import { AxiosInstance, AxiosResponse, AxiosError } from "axios"

export type ApiProviderContextData = {
  apiClient: AxiosInstance | null
  onSuccess?: (response: AxiosResponse) => void
  onUnauthorized?: (error: AxiosError) => void
  onError?: (error: Error | AxiosError) => void
}

export type ApiProviderProps = ApiProviderContextData & {
  children: React.ReactNode
}
