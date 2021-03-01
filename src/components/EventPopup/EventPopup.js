import "./event-popup.scss";

export function EventPopup({ data }) {
  if (!data) {
    return null;
  }

  return (
    <div className="event-popup">
      <p> Event</p>
    </div>
  );
}
