import "./event-popup.scss";
import { CharacterAvatar } from "../CharacterAvatar";

export function EventPopup({ data, eventIndex, setEventIndex }) {
  if (!data) return null;

  const prevIndex = Math.max(eventIndex - 1, 0);
  const nextIndex = Math.min(eventIndex + 1, data.events.length - 1);

  const event = data.events[eventIndex];

  if (!event) {
    console.log("Event undefined: ", eventIndex, data);
  }

  return (
    <div className="event-popup">
      <div className="event-popup__place">{data.name}</div>
      <div className="event-popup__divider" />
      <div className="event-popup__header">
        <p className="event-popup__arrow" onClick={() => setEventIndex(eventIndex === 0 ? eventIndex : prevIndex)}>
          {eventIndex === 0 ? null : "<"}
        </p>
        <h2 className="event-popup__title">{event.name}</h2>
        <p
          className="event-popup__arrow"
          onClick={() => setEventIndex(eventIndex === data.events.length - 1 ? eventIndex : nextIndex)}
        >
          {eventIndex === data.events.length - 1 ? null : ">"}
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
