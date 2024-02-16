import routes from "./routes";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <ul>
        {routes.map((route) => (
          <li key={route.path}>
            <Link to={route.path}>{route.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
