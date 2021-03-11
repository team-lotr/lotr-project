import { useState } from "react";
import "./event-popup.scss";
import { CharacterAvatar } from "../CharacterAvatar";

export function EventPopup({ data }) {
  const initialIndex = data ? data.events.length - 1 : 0;
  const [eventIndex, setEventIndex] = useState(initialIndex);

  if (!data) return null;

  const handleArrowClick = (v) => {
    if (eventIndex === 0 && v === -1) {
      return;
    }
    if (eventIndex === data.events.length - 1 && v === 1) {
      return;
    }
    setEventIndex(eventIndex + v);
  };

  const event = data.events[eventIndex];

  console.log(event);

  return (
    <div className="event-popup">
      <div className="event-popup__place">{data.name}</div>
      <div className="event-popup__divider" />
      <div className="event-popup__header">
        <p className="event-popup__arrow" onClick={() => handleArrowClick(-1)}>
          {"<"}
        </p>
        <h2 className="event-popup__title">{event.name}</h2>
        <p className="event-popup__arrow" onClick={() => handleArrowClick(1)}>
          {">"}
        </p>
      </div>
      <div className="event-popup__content">
        <p className="event-popup__date">{event.date}</p>
        <p className="event-popup__description">{event.description}</p>
        {event.evt_wiki ? (
          <a className="event-popup__wiki" href={event.evt_wiki} target="_blank">
            Read More &gt;
          </a>
        ) : null}
        <div className="event-popup__characters">
          {event.characters.map((c) => (
            <CharacterAvatar key={c.id} character={c} active={true} onClick={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
}
