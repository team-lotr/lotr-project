import "./time-selector.scss";

export function TimeSelector({ time, range, onChange }) {
  function handleChange(value) {
    if (!value) {
      return;
    }
    onChange(value);
  }

  const currentDateIndex = range.findIndex((d) => d.value === time.value);
  const prevDateIndex = currentDateIndex === 0 ? null : currentDateIndex - 1;
  const nextDateIndex = currentDateIndex === range.length - 1 ? null : currentDateIndex + 1;
  const prevDate = range[prevDateIndex];
  const nextDate = range[nextDateIndex];

  return (
    <div className="time-selector">
      <DateDisplay date={range[prevDateIndex]} onClick={() => handleChange(prevDate)} variant="secondary" />
      <Arrow direction={-1} onClick={prevDate ? () => handleChange(prevDate) : null} />
      <DateDisplay date={time} onClick={() => {}} variant="primary" />
      <Arrow direction={1} onClick={nextDate ? () => handleChange(nextDate) : null} />
      <DateDisplay date={range[nextDateIndex]} onClick={() => handleChange(nextDate)} variant="secondary" />
    </div>
  );
}

function Arrow({ direction, onClick }) {
  const symbol = direction > 0 ? ">" : "<";
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
