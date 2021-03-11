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
  let placeIdMap = {};
  for (const [idx, place] of placesRaw.entries()) {
    places.push({
      ...place,
      id: idx,
    });
    placeIdMap[`${place.bookId}:${place.id}`] = idx;
  }
  placeIdMap = processDuplicatedPlaces(placeIdMap);

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

function processDuplicatedPlaces(map) {
  // Merge duplicated entries by having first instance take priority
  map["6:36"] = map["1:11"]; // Prancing Pony 6:36 & 1:11
  map["6:35"] = map["2:1"]; // Rivendell 2:1 & 6:35
  map["6:43"] = map["2:8"] = map["1:1"]; // Hobbiton 1:1 & 2:8 & 6:43
  map["6:44"] = map["1:7"]; // Crickhollow 1:7 & 6:44
  map["6:37"] = map["1:9"]; // House of Tom Bombadil 1:9 & 6:37
  map["6:46"] = map["1:3"]; // Near Woodhall 1:3 & 6:46
  map["3:17"] = map["2:17"]; // Caras Galadhon 2:17 & 3:17
  map["6:30"] = map["3:15"]; // Isengard 3:15 & 6:30
  map["6:32"] = map["3:19"]; // Gap of Rohan 3:19 & 6:32
  map["6:29"] = map["5:5"] = map["3:20"]; // Helm's Deep 3:20 & 5:5 & 6:29
  map["3:3"] = map["2:24"]; // Anduin near Amon Hem 2:24 & 3:3
  map["5:20"] = map["4:8"]; // Near Morhannon 4:8 & 5:20
  map["6:21"] = map["5:22"] = map["4:9"]; // Morannon 4:9 & 5:22 & 6:21
  map["6:28"] = map["5:1"] = map["2:7"]; // Edoras 2:7 & 5:1 & 6:28
  map["6:1"] = map["4:17"]; // Tower of Cirith Ungol 4:17 & 6:1
  map["5:18"] = map["4:15"]; // Minas Morgul 4:15 & 5:18
  map["6:24"] = map["5:13"]; // Pelennor Fields 5:13 & 6:24
  map["6:23"] = map["5:10"]; // Osgiliath 5:10 & 6:23
  map["6:25"] = map["5:3"] = map["2:2"]; // Minas Tirith 2:2 & 5:3 & 6:25

  return map;
}
