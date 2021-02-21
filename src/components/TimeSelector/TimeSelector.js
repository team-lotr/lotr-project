import { LotrDate } from "../../data/LotrDate";
import "./time-selector.scss";

const width = 360;

export function TimeSelector({ time, range, onChange }) {
  function handleChange(value) {
    onChange(value);
  }

  const maxValue = range[range.length - 1].value;
  const minValue = range[0].value;
  const normalizedValues = range.map((date) => date.value / maxValue);
  const logValues = range.map((date) => Math.log(date.value));
  const logNormValues = logValues.map((val) => val / logValues[logValues.length - 1]);
  const minimizedValues = range.map((date) => date.value - minValue);

  return (
    <div className="time-selector">
      <p>{time ? time.lotrDateString : "Select a date"}</p>
      <div className="time-selector__picker">
        {range.map((d) => (
          <Tick date={d} onClick={onChange} />
        ))}
        <div className="time-selector__axis" />
      </div>
    </div>
  );
}

function Tick({ date, onClick }) {
  const val = (date.year - 3001) * 10 + date.month / 2 + date.day * 5;
  return (
    <div
      className="time-selector__tick"
      style={{ transform: `translateX(${val}px` }}
      data-value={date.lotrDateString}
      onClick={() => onClick(date)}
    />
  );
}
