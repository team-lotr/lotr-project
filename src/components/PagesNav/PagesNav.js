import "./pages-nav.scss";

export function PagesNav({ children }) {
  return <div className="pages-nav">{children}</div>;
}

export function PagesNavItem({ label, onClick }) {
  return (
    <div className="pages-nav__item" onClick={onClick}>
      {label}
    </div>
  );
}
