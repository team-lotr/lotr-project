import "./header.scss";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <div className="header">
      <Link as="h1" className="header__title" to="/">
        There and Back Again
      </Link>
      <div className="header__divider" />
      <p className="header__subtitle">Interactive timeline of the Lord of the Rings universe</p>
    </div>
  );
}
