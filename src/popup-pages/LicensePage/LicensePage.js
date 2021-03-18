import "./license-page.scss";

export function LicensePage({ close }) {
  return (
    <div className="license-page">
      <h2>License Information</h2>
      <p>How others can use the project, we do not claim any right to the material blah blah</p>
      <button onClick={close}>Close</button>
    </div>
  );
}
