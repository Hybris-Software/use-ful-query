import Get from "./pages/get";
import Post from "./pages/post";
import NoContext from "./pages/no-context";

export default [
  {
    path: "/get",
    element: Get,
    name: "Get",
  },
  {
    path: "/post",
    element: Post,
    name: "Post",
  },
  {
    path: "/no-context",
    element: NoContext,
    name: "NoContext",
  },
];
