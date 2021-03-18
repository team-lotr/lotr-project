import "./header.scss";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export function Header() {
  const [collapsed, setCollapsed] = useState(false);
  const handleClick = () => {
    if (collapsed) {
      setCollapsed(false);
    }
  };
  return (
    <div className={`header ${collapsed ? "collapsed-header" : ""}`} onClick={handleClick}>
      <span className="header-collapse" onClick={() => setCollapsed(!collapsed)}>
        &#9651;
      </span>
      <Link as="h1" className="header__title" to="/">
        There and Back Again
      </Link>
      <div className="header__divider" />
      <p className="header__subtitle">Interactive timeline of the Lord of the Rings universe</p>
    </div>
  );
}
