import "./license-page.scss";

export function LicensePage({ close }) {
  return (
    <div className="license-page">
      <h2 className="license-page__title">License Information</h2>
      <a href="https://github.com/team-lotr/lotr-project">Github Repository (Source Code)</a>
      <p>
        This project is licensed under the&nbsp;
        <a href="https://choosealicense.com/licenses/mit/">MIT License</a>, allowing for commercial use, distribution,
        modification and private use.
      </p>
      <p>
        "There and Back Again" is not associated with Middle-earth Enterprises nor the Tolkien Estates. It is driven by
        the passion for Tolkiens works.
      </p>
      <button className="license-page__button" onClick={close}>
        Close
      </button>
    </div>
  );
}
