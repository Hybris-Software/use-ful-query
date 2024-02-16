import Get from "./pages/get";
import Post from "./pages/post";

export default [
  {
    path: "/get",
    element: <Get />,
    name: "Get",
  },
  {
    path: "/post",
    element: <Post />,
    name: "Post",
  },
];
