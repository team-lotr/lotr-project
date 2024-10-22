import "./how-to-page.scss";

export function HowToPage({ close }) {
  return (
    <div className="how-to-page">
      <h2 className="how-to-page__title">How To</h2>
      <p className="how-to-page__description">
        Reading instructions can be monotonous, so here is a video that explains all the main interactive elements of
        the visualisation.
      </p>
      <iframe
        className="how-to-page__video"
        // width="560"
        // height="315"
        src="https://www.youtube.com/embed/VhQVod8sivg"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <button className="how-to-page__button" onClick={close}>
        Close
      </button>
    </div>
  );
}
