import "./tutorial-popup.scss";
import { useState } from "react";

const SEEN_TUTORIAL_KEY = "seen-tutorial";

export function TutorialPopup() {
  const [isShown, setIsShown] = useState(sessionStorage.getItem(SEEN_TUTORIAL_KEY) !== "true");

  function handleAction() {
    sessionStorage.setItem(SEEN_TUTORIAL_KEY, "true");
    setIsShown(false);
  }

  return (
    <>
      {isShown ? (
        <>
          <div className="tutorial-popup__cover" />
          <div className="tutorial-popup">
            <div className="tutorial-popup__container">
              <h1 className="tutorial-popup__title">There and Back Again</h1>
              <div className="tutorial-popup__divider" />
              <div className="tutorial-popup__content">
                <p>
                  Welcome to <i>There and Back Again</i>, an interactive visualisation of the the travel timelines of
                  the fellowship in the Lord of the Rings. This visualisation is based on <a target="_blank" href="https://docs.google.com/spreadsheets/d/15ykK0MIWrG7DyYbbWT8skaWTP3jfUjdVhIKg76N5BWE/edit?usp=sharing">data  &#8599;</a> that has been carefully
                  selected from Tolkien's triology.
                </p>
                <p>
                  The map is fully interactive, allowing you to filter out the character timelines you are interested in
                  by clicking on the character portraits. To go forward in time, use the time selector at the bottom of
                  the screen.
                </p>
                <p>
                  You can reveal more information about the timeline by clicking the event highlights on the map. You
                  can also hover over character paths to focus on that particular one.
                </p>
                <p className="tutorial-popup__quote">
                  “For even the very wise cannot see all ends.”
                  <br />
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;― J.R.R. Tolkien, The Fellowship of the Ring</span>
                </p>
              </div>
              <button onClick={handleAction} className="tutorial-popup__button">
                Let's get started!
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
