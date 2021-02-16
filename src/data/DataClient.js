import characters from "./characters.json";
import events from "./events.json";
import places from "./places";

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

  createTimeline(events) {
    return events.map((e) => {
      const place = this.getPlaceBy("id", e.place);
      return {
        eventId: e.id,
        eventName: e.name,
        description: e.description,
        date: e.date,
        x: place.x,
        y: place.y,
      };
    });
  }

  getCharacterTimelineBy(field, value) {
    const character = this.getCharacterBy(field, value);
    const characterEvents = this.getEventsById(character.events);
    const timeline = this.createTimeline(characterEvents);

    return timeline;
  }
}
