import { useState } from "react";
import { ApiProvider, generateApiClient, useQuery } from "use-ful-query";

export default function Post() {
  const apiClient = generateApiClient({
    baseUrl: "https://jsonplaceholder.typicode.com",
  });

  return (
    <ApiProvider apiClient={apiClient}>
      <PageContent />
    </ApiProvider>
  );
}

function PageContent() {
  const { data, status, executeQuery } = useQuery({
    url: "/posts",
    method: "POST",
  });

  const [title, setTitle] = useState("");

  return (
    <div>
      <h1>Post</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={() => executeQuery({ title })}>Click me</button>
      <p>Status: {status}</p>
      <p>Response: {JSON.stringify(data)}</p>
    </div>
  );
}
