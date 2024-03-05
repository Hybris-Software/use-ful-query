import React from "react"
import { AxiosInstance } from "axios"

export type ApiProviderContextData = {
  apiClient: AxiosInstance | null
  onUnauthorized?: any // TODO
}

export type ApiProviderProps = ApiProviderContextData & {
  children: React.ReactNode
}
