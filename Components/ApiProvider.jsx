import React from "react";
import ApiProviderContext from "../Context/apiProviderContext";

const ApiProvider = ({ children, apiClient }) => {
  return (
    <ApiProviderContext.Provider value={apiClient}>
      {children}
    </ApiProviderContext.Provider>
  );
};

export default ApiProvider;
