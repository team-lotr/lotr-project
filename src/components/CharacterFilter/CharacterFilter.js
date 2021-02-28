import "./character-filter.scss";
import { CharacterAvatar } from "../CharacterAvatar";

export function CharacterFilter({ data, activeCharacters, setActiveCharacters }) {
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
    <div className="character-filter">
      <h2 className="character-filter__title">Characters</h2>
      <div className="character-filter__items">
        {data.map((c) => {
          const characterIsActive = activeCharacters.includes(c.id);
          return (
            <CharacterAvatar key={c.id} character={c} active={characterIsActive} onClick={handleCharacterAvatarClick} />
          );
        })}
      </div>
    </div>
  );
}
