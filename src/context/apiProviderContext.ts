import { createContext } from "react"
import { ApiProviderContextData } from "../types"

const defaultApiProviderContextData: ApiProviderContextData = {
  apiClient: null,
  onUnauthorized: null,
  onError: null,
  onSuccess: null,
}

export const ApiProviderContext = createContext<ApiProviderContextData>(
  defaultApiProviderContextData
)
