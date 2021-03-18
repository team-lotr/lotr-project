import "./character-filter.scss";
import { CharacterAvatar } from "../CharacterAvatar";
import React, { useState } from "react";

export function CharacterFilter({ data, activeCharacters, setActiveCharacters }) {
  const [collapsed, setCollapsed] = useState(false);

  function handleCharacterAvatarClick(characterId) {
    let newActiveCharacters;
    if (activeCharacters.includes(characterId)) {
      newActiveCharacters = activeCharacters.filter((id) => id !== characterId);
    } else {
      newActiveCharacters = [...activeCharacters, characterId];
    }
    setActiveCharacters(newActiveCharacters);
  }

  return (
    <div
      className={`character-filter ${collapsed ? "collapsed-character-filter" : ""}`}
      onClick={() => collapsed && setCollapsed(false)}
    >
      <span className="character-filter__collapse" onClick={() => setCollapsed(true)}>
        &#9665;
      </span>
      <h2 className="character-filter__title">Characters</h2>
      <div className="character-filter__items">
        {data.map((c) => {
          const characterIsActive = activeCharacters.includes(c.id);
          return (
            <CharacterAvatar key={c.id} character={c} active={characterIsActive} onClick={handleCharacterAvatarClick} />
          );
        })}
      </div>
      <div className="character-filter__buttons">
        <div className="character-filter__button" onClick={() => setActiveCharacters(data.map((c) => c.id))}>
          Select All
        </div>
        <div className="character-filter__button" onClick={() => setActiveCharacters([])}>
          Clear
        </div>
      </div>
    </div>
  );
}
