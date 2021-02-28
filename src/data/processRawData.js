import charactersRaw from "./datasets/characters_raw.json";
import eventsRaw from "./datasets/events_raw.json";
import placesRaw from "./datasets/places_raw.json";
import theRingImage from "../assets/character-the-ring.png";

const characterBookEventKeys = ["events_book1", "events_book2", "events_book3"];
const characterImageIds = {
  1: theRingImage,
  2: theRingImage,
  3: theRingImage,
  4: theRingImage,
  5: theRingImage,
  6: theRingImage,
  7: theRingImage,
  8: theRingImage,
  9: theRingImage,
  10: theRingImage,
  11: theRingImage,
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

  // Filter out anything past book 3 since that data is not complete yet
  places = places.filter((p) => p.bookId <= 3);
  events = events.filter((e) => e.bookId <= 3);

  return [characters, events, places];
}
