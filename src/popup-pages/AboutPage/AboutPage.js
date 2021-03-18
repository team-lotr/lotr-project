import "./about-page.scss";

export function AboutPage({ close }) {
  return (
    <div className="about-page">
      <h2 className="about-page__title">About</h2>
      <p>This is some info about the project, motivations, what the team members are and what we all did</p>
      <button className="about-page__button" onClick={close}>
        Close
      </button>
    </div>
  );
}
