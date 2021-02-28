import { LotrDate } from "./LotrDate";
import { processRawData } from "./processRawData";

const [characters, events, places] = processRawData();

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

  getCharacterBy(field, value) {
    this.validateCharacterField(field, value);
    const character = characters.find((c) => c[field] === value);

    if (!character) {
      throw new Error(`Could not find character with ${field} = ${value}`);
    }

    return character;
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
        description: e.description,
        chapter: e.chapter,
        lotrDate: e.date,
        lotrDateValue: new LotrDate(e.date).value,
        placeId: place.id,
        x: place.x,
        y: place.y,
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

  getAll(dataType) {
    if (!["event", "place", "character"].includes(dataType)) {
      throw new Error("Not a valid data type");
    }

    switch (dataType) {
      case "event":
        return [...events];
      case "place":
        return [...places];
      case "character":
        return [...characters].map((e) => ({ ...e, events: [...e.events] }));
      default:
        return null;
    }
  }

  getDistinctDates() {
    let allDates = events.map((e) => new LotrDate(e.date));
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
}
