import "./time-selector.scss";

export function TimeSelector({ time, range, onChange, selectedDateField }) {
  function handleChange(value) {
    if (!value) {
      return;
    }
    onChange(value);
  }

  let currentRange;
  if (selectedDateField === "start") {
    currentRange = range.filter((d) => d.value < time.end.value);
  } else if (selectedDateField === "end") {
    currentRange = range.filter((d) => d.value > time.start.value);
  }

  const firstIdx = 0;
  const lastIdx = currentRange.length - 1;
  const currentIdx = currentRange.findIndex((d) => d.value === time[selectedDateField].value);
  const prevIdx = currentIdx === firstIdx ? null : currentIdx - 1;
  const nextIdx = currentIdx === lastIdx ? null : currentIdx + 1;

  const prevDate = currentRange[prevIdx];
  const firstDate = currentRange[firstIdx];
  const nextDate = currentRange[nextIdx];
  const lastDate = currentRange[lastIdx];

  return (
    <div className="time-selector">
      <DateDisplay date={prevDate} onClick={() => handleChange(prevDate)} variant="secondary" />
      <Arrow symbol="<<" onClick={prevDate ? () => handleChange(firstDate) : null} />
      <Arrow symbol="<" onClick={prevDate ? () => handleChange(prevDate) : null} />
      <DateDisplay date={time[selectedDateField]} onClick={() => {}} variant="primary" />
      <Arrow symbol=">" onClick={nextDate ? () => handleChange(nextDate) : null} />
      <Arrow symbol=">>" onClick={nextDate ? () => handleChange(lastDate) : null} />
      <DateDisplay date={nextDate} onClick={() => handleChange(nextDate)} variant="secondary" />
    </div>
  );
}

function Arrow({ symbol, onClick }) {
  return (
    <div className="time-selector__arrow" onClick={onClick}>
      {onClick ? symbol : null}
    </div>
  );
}

function DateDisplay({ date, onClick, variant }) {
  return (
    <div className="time-selector__date" data-variant={variant}>
      <p className="time-selector__datevalue" onClick={onClick}>
        {date ? date.lotrDateString : null}
      </p>
    </div>
  );
}
