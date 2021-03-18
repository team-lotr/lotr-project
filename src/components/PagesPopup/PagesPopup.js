import "./pages-popup.scss";
import React from "react";

export function PagesPopup({ activePage, onClose, children }) {
  if (!activePage) {
    return null;
  }

  let pageComponent = null;
  React.Children.forEach(children, (child) => {
    if (child.key === activePage) {
      pageComponent = React.cloneElement(child, { close: onClose });
    }
  });

  return (
    <>
      <div className="pages-popup__cover" />
      <div className="pages-popup">
        <div className="pages-popup__container">
          <p onClick={onClose}>X</p>
          {pageComponent}
        </div>
      </div>
    </>
  );
}
