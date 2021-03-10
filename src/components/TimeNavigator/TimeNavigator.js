import "./time-navigator.scss";
import { ReactComponent as BookIcon } from "../../assets/book.svg";
import { useState } from "react";
import { LotrDate } from "../../data/LotrDate";

const bookIds = [1, 2, 3, 4, 5, 6];
const TOTAL_BOOKS = 6;

const startDate = new LotrDate("30 Oct 3018");
const endDate = new LotrDate("20 Nov 3020");

export function TimeNavigator() {
  const [activeBookIds, setActiveBookIds] = useState(bookIds);
  const [selectedDateField, setSelectedDateField] = useState("end"); // "start" | "end"

  function handleBookClick(id) {
    activeBookIds.includes(id)
      ? setActiveBookIds(activeBookIds.filter((i) => i !== id))
      : setActiveBookIds([...activeBookIds, id]);
  }

  return (
    <div className="time-navigator">
      <div className="time-navigator__books">
        {bookIds.map((id) => (
          <BookButton key={id} id={id} onClick={handleBookClick} active={activeBookIds.includes(id)} />
        ))}
      </div>
      <div className="time-navigator__container">
        <div className="time-navigator__state">
          <span className="time-navigator__state-text">Showing</span>
          <span className="time-navigator__state-field">{getBookStateText(activeBookIds)}</span>
          <span className="time-navigator__state-text">events from</span>
          <span
            className="time-navigator__state-field"
            onClick={() => setSelectedDateField("start")}
            data-active={selectedDateField === "start"}
          >
            {startDate.lotrDateString}
          </span>
          <span className="time-navigator__state-text">to</span>
          <span
            className="time-navigator__state-field"
            onClick={() => setSelectedDateField("end")}
            data-active={selectedDateField === "end"}
          >
            {endDate.lotrDateString}
          </span>
        </div>
        <div className="time-navigator__selector"></div>
      </div>
    </div>
  );
}

function getBookStateText(bookIds) {
  if (bookIds.length === TOTAL_BOOKS) {
    return "all book";
  }

  if (bookIds.length === 0) {
    return "no book";
  }

  return `book ${bookIds.sort().join(",")}`;
}

function BookButton({ id, onClick, active }) {
  return (
    <div className="book-button" onClick={() => onClick(id)} data-active={active}>
      <BookIcon className="book-button__icon" />
      <p className="book-button__id">{id}</p>
    </div>
  );
}
