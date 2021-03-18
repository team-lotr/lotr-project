import "./how-to-page.scss";

export function HowToPage({ close }) {
  return (
    <div className="how-to-page">
      <h2>How To</h2>
      <p>This is how you use the app, here is a nice video that you can watch</p>
      <button onClick={close}>Close</button>
    </div>
  );
}
