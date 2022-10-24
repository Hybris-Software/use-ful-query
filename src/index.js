import useQuery from "./Hooks/useQuery";
import useMultipleQueries from "./Hooks/useMultipleQueries";
import { generateApiClient, generateJwtApiClient } from "./Api/client";
import ApiProvider from "./Components/ApiProvider";

export default useQuery;
export {
  useMultipleQueries,
  generateApiClient,
  generateJwtApiClient,
  ApiProvider,
};
