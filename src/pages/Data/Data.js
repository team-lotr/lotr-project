import { useState } from "react";
import { Nav } from "../../components/Nav";
import "./data.scss";
import { DataClient } from "../../data/DataClient";

const dataClient = new DataClient();
const characters = dataClient.getAll("character");

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
  const currentCharacter = dataClient.getCharacterBy("name", characterName);
  const characterEvents = dataClient.getEventsById(currentCharacter.events);

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
