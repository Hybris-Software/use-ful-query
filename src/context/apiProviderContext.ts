import { createContext } from "react"
import { ApiProviderContextData } from "../types"

const defaultApiProviderContextData: ApiProviderContextData = {
  apiClient: undefined,
  onUnauthorized: undefined,
  onError: undefined,
  onSuccess: undefined,
}

export const ApiProviderContext = createContext<ApiProviderContextData>(
  defaultApiProviderContextData
)
