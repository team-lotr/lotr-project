import "./tutorial-page.scss";
import { SEEN_TUTORIAL_KEY } from "../../constants";

export function TutorialPage({ close }) {
  function handleClose() {
    sessionStorage.setItem(SEEN_TUTORIAL_KEY, "true");
    close();
  }

  return (
    <div className="tutorial-page">
      <span className="tutorial-page__close" onClick={handleClose}>
        X
      </span>
      <h1 className="tutorial-page__title">There and Back Again</h1>
      <div className="tutorial-page__divider" />
      <div className="tutorial-page__content">
        <p>
          Welcome to <i>There and Back Again</i>, an interactive visualisation of the the travel timelines of the
          fellowship in the Lord of the Rings. This visualisation is based on data that has been carefully selected from
          Tolkien's triology.
        </p>
        <p>
          The map is fully interactive, allowing you to filter out the character timelines you are interested in by
          clicking on the character portraits. To go forward in time, use the time selector at the bottom of the screen.
        </p>
        <p>
          You can reveal more information about the timeline by clicking the event highlights on the map. You can also
          hover over character paths to focus on that particular one.
        </p>
        <p className="tutorial-page__quote">
          “For even the very wise cannot see all ends.”
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;― J.R.R. Tolkien, The Fellowship of the Ring</span>
        </p>
      </div>
      <button onClick={handleClose} className="tutorial-page__button">
        Let's get started!
      </button>
    </div>
  );
}
