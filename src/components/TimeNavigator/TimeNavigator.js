import "./time-navigator.scss";

export function TimeNavigator() {
  return (
    <div className="time-navigator">
      <div className="time-navigator__books"></div>
      <div className="time-navigator__container">
        <div className="time-navigator__state">Showing all book events from [some date] to [some date]</div>
        <div className="time-navigator__selector"></div>
      </div>
    </div>
  );
}
