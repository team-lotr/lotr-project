import charactersRaw from "./datasets/characters_raw.json";
import eventsRaw from "./datasets/events_raw.json";
import placesRaw from "./datasets/places_raw.json";

const characterBookEventKeys = ["events_book1", "events_book2", "events_book3"];
const characterImageIds = {
  1: "character-the-ring.png",
  2: "character-the-ring.png",
  3: "character-the-ring.png",
  4: "character-the-ring.png",
  5: "character-the-ring.png",
  6: "character-the-ring.png",
  7: "character-the-ring.png",
  8: "character-the-ring.png",
  9: "character-the-ring.png",
  10: "character-the-ring.png",
  11: "character-the-ring.png",
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
      imageId: characterImageIds[character.id]
    });
  }

  // Filter out anything past book 3 since that data is not complete yet
  places = places.filter((p) => p.bookId <= 3);
  events = events.filter((e) => e.bookId <= 3);

  return [characters, events, places];
}
