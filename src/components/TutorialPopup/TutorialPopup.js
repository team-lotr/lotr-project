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
              Tutorial Popup
              <p>Is shown: {isShown ? "Yeah!" : "Nah!"}</p>
              <button onClick={handleAction}>Okay!</button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
