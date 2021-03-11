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

export function Setting({ label, value, type, onChange, min, max, step }) {
  // Should handle scalar and boolean values

  if (type === "boolean") {
    return (
      <label className="setting setting--boolean">
        {label}
        <input type="checkbox" checked={value} onChange={() => onChange(!value)} />
      </label>
    );
  }

  if (type === "scalar") {
    return (
      <label className="setting setting--scalar">
        {label}:<p className="setting__value">{value}</p>
        <p className="setting__button" onClick={() => onChange(Math.max(value - step, min))}>
          -
        </p>
        <p className="setting__button" onClick={() => onChange(Math.min(value + step, max))}>
          +
        </p>
      </label>
    );
  }

  return null;
}
