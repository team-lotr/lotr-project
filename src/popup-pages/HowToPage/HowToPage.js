import "./how-to-page.scss";

export function HowToPage({ close }) {
  return (
    <div className="how-to-page">
      <h2 className="how-to-page__title">How To</h2>
      <p>This is how you use the app, here is a nice video that you can watch</p>
      <button className="how-to-page__button" onClick={close}>
        Close
      </button>
    </div>
  );
}
