import "./character-avatar.scss";

export function CharacterAvatar({ character, active, onClick }) {
  return (
    <div className="character-avatar" onClick={() => onClick(character.id)} data-active={active}>
      <img
        className="character-avatar__image"
        src={character.image}
        style={{ borderColor: character.color1 }}
      />
      <p className="character-avatar__name">{character.name}</p>
    </div>
  );
}
