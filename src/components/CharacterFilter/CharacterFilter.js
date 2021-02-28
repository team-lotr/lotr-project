import "./character-filter.scss";
import { CharacterAvatar } from "../CharacterAvatar";

export function CharacterFilter() {
  return (
    <div className="character-filter">
      <h2 className="character-filter__title">Characters</h2>
      <CharacterAvatar />
    </div>
  );
}
