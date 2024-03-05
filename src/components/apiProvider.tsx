import React from "react"
import { ApiProviderContext } from "../context/apiProviderContext"
import { ApiProviderProps } from "../types"

export const ApiProvider = ({
  children,
  apiClient,
  onUnauthorized,
}: ApiProviderProps) => {
  return (
    <ApiProviderContext.Provider value={{ apiClient, onUnauthorized }}>
      {children}
    </ApiProviderContext.Provider>
  )
}
