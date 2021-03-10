import charactersRaw from "./datasets/characters_raw.json";
import eventsRaw from "./datasets/events_raw.json";
import placesRaw from "./datasets/places_raw.json";
import controlPointsRaw from "./datasets/control_points_raw.json";
import theRingImage from "../assets/character-the-ring.png";
import aragornImage from "../assets/character-aragorn.jpeg";
import bilboImage from "../assets/character-bilbo.jpg";
import boromirImage from "../assets/character-boromir.jpeg";
import frodoImage from "../assets/character-frodo.png";
import gandalfImage from "../assets/character-gandalf.jpeg";
import gimliImage from "../assets/character-gimli.jpeg";
import legolasImage from "../assets/character-legolas.jpeg";
import merryImage from "../assets/character-merry.jpg";
import pippinImage from "../assets/character-pippin.jpg";
import samImage from "../assets/character-sam.jpeg";

const ACTIVE_BOOK_IDS = [1, 2, 3, 4, 5, 6];
const characterBookEventKeys = ACTIVE_BOOK_IDS.map((i) => `events_book${i}`);
const characterImageIds = {
  1: theRingImage,
  2: bilboImage,
  3: frodoImage,
  4: samImage,
  5: merryImage,
  6: pippinImage,
  7: aragornImage,
  8: legolasImage,
  9: gimliImage,
  10: gandalfImage,
  11: boromirImage,
};

export function processRawData() {
  let places = [];
  const placeIdMap = {};
  for (const [idx, place] of placesRaw.entries()) {
    places.push({
      ...place,
      id: idx,
    });
    placeIdMap[`${place.bookId}:${place.id}`] = idx;
  }

  let events = [];
  const eventIdMap = {};
  for (const [idx, event] of eventsRaw.entries()) {
    events.push({
      id: idx,
      bookId: event.bookId,
      chapter: event.chapter,
      date: `${event.date}`,
      name: event.name,
      placeId: placeIdMap[`${event.bookId}:${event.place}`],
      description: event.description,
      evt_type: event.evt_type,
      evt_wiki: event.evt_wiki,
      full_id: `${event.bookId}:${event.id}`,
    });
    eventIdMap[`${event.bookId}:${event.id}`] = idx;
  }

  let characters = [];
  for (const character of charactersRaw) {
    const characterEvents = [];
    for (const [idx, key] of characterBookEventKeys.entries()) {
      let characterBookEventsStr = character[key];
      if (typeof characterBookEventsStr === "number") {
        characterBookEventsStr = `${characterBookEventsStr}`;
      } else if (characterBookEventsStr === "") {
        continue;
      }
      let characterBookEvents = characterBookEventsStr.split(",").map(Number);
      characterBookEvents = characterBookEvents.map((eId) => eventIdMap[`${idx + 1}:${eId}`]);
      characterEvents.push(...characterBookEvents);
    }

    characters.push({
      id: character.id,
      color1: character.color1,
      color2: character.color2,
      name: character.name,
      events: characterEvents,
      image: characterImageIds[character.id],
    });
  }

  return [characters, events, places, controlPointsRaw];
}
