import { useState } from "react";
import { Nav } from "../../components/Nav";
import "./data.scss";
import events from "../../data/datasets/events.json";
import characters from "../../data/datasets/characters.json";
import places from "../../data/datasets/places.json";

function getCharacterById(id) {
  return characters.find((character) => character.id === id);
}

function getCharacterByName(name) {
  return characters.find((character) => character.name === name);
}

function getEventsWithCharacter(characterId) {
  const character = getCharacterById(characterId);
  return events.filter((event) => character.events.includes(event.id));
}

export function Data() {
  const [currentCharacterName, setCurrentCharacter] = useState("None");

  function handleCharacterSelect(characterName) {
    setCurrentCharacter(characterName);
  }

  return (
    <div className="data-page">
      <Nav />
      <CharacterSelect
        characterName={currentCharacterName}
        onChange={(event) => handleCharacterSelect(event.target.value)}
      />
      {currentCharacterName !== "None" && <CharacterEvents characterName={currentCharacterName} />}
    </div>
  );
}

function CharacterSelect({ characterName, onChange }) {
  return (
    <>
      <label htmlFor="character">Choose a Character:</label>
      <select name="character" id="characters" value={characterName} onChange={onChange}>
        {characters
          .map((i) => i.name)
          .map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
      </select>
    </>
  );
}

function CharacterEvents({ characterName }) {
  const currentCharacter = getCharacterByName(characterName);
  const characterEvents = getEventsWithCharacter(currentCharacter.id);

  return (
    <div>
      <p>Events:</p>
      {characterEvents.map((event) => (
        <p key={event.id}>
          {event.name} - {event.date}
        </p>
      ))}
    </div>
  );
}
