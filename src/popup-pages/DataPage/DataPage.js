import "./data-page.scss";

export function DataPage({ close }) {
  return (
    <div className="data-page">
      <h2>Datasets</h2>
      <p>This is our datasets, here is handy download link, this is how we have created it</p>
      <button onClick={close}>Close</button>
    </div>
  );
}
