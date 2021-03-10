import "./time-navigator.scss";
import { ReactComponent as BookIcon } from "../../assets/book.svg";
import { useState } from "react";
import { LotrDate } from "../../data/LotrDate";
import { TimeSelector } from "../TimeSelector/TimeSelector";

const bookIds = [1, 2, 3, 4, 5, 6];
const TOTAL_BOOKS = 6;

const startDate = new LotrDate("30 Oct 3018");
const endDate = new LotrDate("20 Nov 3020");

export function TimeNavigator({ activeBookIds, setActiveBookIds, dateRange, setDateRange, fullDateRange }) {
  const [selectedDateField, setSelectedDateField] = useState("end"); // "start" | "end"

  function handleBookClick(id) {
    activeBookIds.includes(id)
      ? setActiveBookIds(activeBookIds.filter((i) => i !== id))
      : setActiveBookIds([...activeBookIds, id]);
  }

  function handleDateChange(newDate) {
    console.log(selectedDateField);
    console.log(newDate);
    const newDateRange = {
      ...dateRange
    }
    newDateRange[selectedDateField] = newDate;
    setDateRange(newDateRange);
  }

  if (!activeBookIds) {
    return null;
  }

  return (
    <div className="time-navigator">
      <div className="time-navigator__books">
        {activeBookIds &&
          bookIds.map((id) => (
            <BookButton key={id} id={id} onClick={handleBookClick} active={activeBookIds.includes(id)} />
          ))}
      </div>
      <div className="time-navigator__container">
        <div className="time-navigator__state">
          <span className="time-navigator__state-text">Showing</span>
          <span className="time-navigator__state-field time-navigator__state-field--book">{getBookStateText(activeBookIds)}</span>
          <span className="time-navigator__state-text">events from</span>
          <span
            className="time-navigator__state-field time-navigator__state-field--date"
            onClick={() => setSelectedDateField("start")}
            data-active={selectedDateField === "start"}
          >
            {dateRange.start.lotrDateString}
          </span>
          <span className="time-navigator__state-text">to</span>
          <span
            className="time-navigator__state-field time-navigator__state-field--date"
            onClick={() => setSelectedDateField("end")}
            data-active={selectedDateField === "end"}
          >
            {dateRange.end.lotrDateString}
          </span>
        </div>
        <TimeSelector
          time={dateRange}
          selectedDateField={selectedDateField}
          range={fullDateRange}
          onChange={handleDateChange}
        />
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
