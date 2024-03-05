import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./app.css";

import routes from "./routes";
import { HomePage } from "./home";

import { ApiProvider, generateApiClient } from "use-ful-query";

const router = createBrowserRouter(
  routes
    .map((route) => {
      return {
        path: route.path,
        element: <route.element />,
      };
    })
    .concat({
      path: "*",
      element: <HomePage />,
    })
);

function App() {
  const apiClient = generateApiClient({
    baseUrl: "https://jsonplaceholder.typicode.com",
  });

  return (
    <ApiProvider apiClient={apiClient}>
      <RouterProvider router={router} />
    </ApiProvider>
  );
}

export default App;
