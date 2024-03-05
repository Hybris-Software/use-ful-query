import { ApiProvider, generateApiClient, useQuery } from "use-ful-query"

export default function Get() {
  const apiClient = generateApiClient({
    baseUrl: "https://jsonplaceholder.typicode.com",
  })

  return (
    <ApiProvider apiClient={apiClient}>
      <PageContent />
    </ApiProvider>
  )
}

function PageContent() {
  const { data, isLoading } = useQuery({
    url: "/posts",
    executeImmediately: true,
  })

  return (
    <div>
      <h1>Get</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        data?.map((post: any) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  )
}
