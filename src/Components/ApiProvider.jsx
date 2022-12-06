import React from "react";
import ApiProviderContext from "../Context/ApiProviderContext";

const ApiProvider = ({ children, apiClient, onUnauthorized }) => {
  return (
    <ApiProviderContext.Provider value={{apiClient, onUnauthorized}}>
      {children}
    </ApiProviderContext.Provider>
  );
};

export default ApiProvider;
