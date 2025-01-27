import { LotrDate } from "./LotrDate";
import { processRawData } from "./processRawData";

const [characters, events, places, controlPointsRaw] = processRawData();

const defaultSearchFields = {
  id: "number",
  name: "string",
};

const characterSearchFields = {
  ...defaultSearchFields,
};
const eventSearchFields = {
  ...defaultSearchFields,
};
const placeSearchFields = {
  ...defaultSearchFields,
};

function fieldValidationFactory(allowedFields) {
  return function validateField(field, value) {
    if (!Object.keys(allowedFields).includes(field)) {
      throw new Error(`"${field}" is not a valid search field`);
    }
    if (typeof value !== allowedFields[field]) {
      throw new Error(`(${value}) is not a valid value for ${field}`);
    }
  };
}

export class DataClient {
  constructor() {
    this.validateCharacterField = fieldValidationFactory(characterSearchFields);
    this.validateEventField = fieldValidationFactory(eventSearchFields);
    this.validatePlaceField = fieldValidationFactory(placeSearchFields);
  }

  getControlPoints(character) {
    return controlPointsRaw[character] || {};
  }

  getCharacterBy(field, value) {
    this.validateCharacterField(field, value);
    const character = characters.find((c) => c[field] === value);

    if (!character) {
      throw new Error(`Could not find character with ${field} = ${value}`);
    }

    return character;
  }

  getCharactersById(characterIds) {
    if (!characterIds.every(Number.isInteger)) {
      throw new Error(`Received some invalid characterIds: (${characterIds})`);
    }

    return characters.filter((c) => characterIds.includes(c.id));
  }

  getEventBy(field, value) {
    this.validateEventField(field, value);
    const event = events.find((e) => e[field] === value);

    if (!event) {
      throw new Error(`Could not find event with ${field} = ${value}`);
    }

    return event;
  }

  getPlaceBy(field, value) {
    this.validatePlaceField(field, value);
    const place = places.find((p) => p[field] === value);

    if (!place) {
      throw new Error(`Could not find place with ${field} = ${value}`);
    }

    return place;
  }

  getEventsById(eventIds) {
    if (!eventIds.every(Number.isInteger)) {
      throw new Error(`Received some invalid eventIds: (${eventIds})`);
    }

    return events.filter((e) => eventIds.includes(e.id));
  }

  createTimeline(events, sorting) {
    const timeline = events.map((e) => {
      const place = this.getPlaceBy("id", e.placeId);
      return {
        eventId: e.id,
        eventName: e.name,
        bookId: e.bookId,
        description: e.description,
        chapter: e.chapter,
        lotrDate: e.date,
        lotrDateValue: new LotrDate(e.date).value,
        placeId: place.id,
        x: place.x,
        y: place.y,
        fullId: e.full_id,
      };
    });
    const sortedTimeline = timeline.sort((eventA, eventB) => eventA[sorting] - eventB[sorting]);
    return sortedTimeline;
  }

  getCharacterTimelineBy(field, value, sorting) {
    const character = this.getCharacterBy(field, value);
    const characterEvents = this.getEventsById(character.events);
    const timeline = this.createTimeline(characterEvents, sorting);

    return timeline;
  }

  getAll(dataType, field = null) {
    if (!["event", "place", "character"].includes(dataType)) {
      throw new Error("Not a valid data type");
    }

    let result;
    switch (dataType) {
      case "event":
        result = field ? events.map((e) => e[field]) : [...events];
        break;
      case "place":
        result = field ? places.map((p) => p[field]) : [...places];
        break;
      case "character":
        result = field ? characters.map((c) => c[field]) : characters.map((e) => ({ ...e, events: [...e.events] }));
        break;
      default:
        result = [];
    }
    return result;
  }

  getDistinctDates(activeBookIds) {
    let eventsForActiveBooks = events.filter((e) => activeBookIds.includes(e.bookId));
    let allDates = eventsForActiveBooks.map((e) => new LotrDate(e.date));
    allDates.sort((dateA, dateB) => dateA.value - dateB.value);
    let resultDates = [];
    for (const date of allDates) {
      if (resultDates.find((d) => d.value === date.value)) {
        // Don't add to results
      } else {
        resultDates.push(date);
      }
    }
    return resultDates;
  }

  getCharactersForEvents(eventIds) {
    const characters = this.getAll("character");
    let matchingCharacterIds = [];
    for (const eventId in eventIds) {
      const matchingCharacters = characters.filter((c) => c.events.includes(eventId));
      const temp = matchingCharacters.map((c) => c.id);
      matchingCharacterIds.push(...temp);
    }
    return Array.from(new Set(matchingCharacterIds));
  }

  getDistinctBookIds() {
    const bookIds = events.map((e) => e.bookId);
    return Array.from(new Set(bookIds));
  }

  getPlacesWithEventData(characterIds, bookIds, dateRange) {
    const allCharacters = this.getAll("character");

    let allCharacterEventIds = [];
    for (const characterId of characterIds) {
      const character = this.getCharacterBy("id", characterId);
      allCharacterEventIds.push(...character.events);
    }
    allCharacterEventIds = Array.from(new Set(allCharacterEventIds));

    let allPlaces = this.getAll("place");
    allPlaces = allPlaces.filter((p) => {
      if (p.allPlaceBookIds) {
        return Boolean(bookIds.filter((id) => p.allPlaceBookIds.includes(id)).length);
      }
      return bookIds.includes(p.bookId);
    });

    let allEvents = this.getAll("event");
    allEvents = allEvents.map((e) => {
      return {
        ...e,
        characters: allCharacters.filter((c) => c.events.includes(e.id)),
        lotrDateValue: new LotrDate(e.date).value,
      };
    });

    const results = [];
    for (const place of allPlaces) {
      let placeEvents = allEvents.filter((e) => e.placeId === place.id);
      placeEvents = placeEvents.filter(
        (e) => e.lotrDateValue >= dateRange.start.value && e.lotrDateValue <= dateRange.end.value
      );
      placeEvents = placeEvents.filter((e) => allCharacterEventIds.includes(e.id));

      placeEvents.sort((firstEvt, secondEvt) => firstEvt.lotrDateValue - secondEvt.lotrDateValue);
      results.push({
        ...place,
        events: placeEvents,
      });
    }

    return results;
  }
}
