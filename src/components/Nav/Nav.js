import { Link } from "react-router-dom";

export function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/demo">Demo</Link>
        </li>
      </ul>
    </nav>
  );
}
