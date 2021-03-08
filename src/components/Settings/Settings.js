import "./settings.scss";
import { useState } from "react";
import { ReactComponent as CaretDown } from "../../assets/caret-down.svg";

export function Settings({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="settings">
      <div className="settings__header">
        <p>Settings</p>
        <CaretDown className="settings__caret" onClick={() => setIsOpen(!isOpen)} data-open={isOpen} />
      </div>
      {isOpen && <div className="settings__content">{children}</div>}
    </div>
  );
}
