import { DataClient } from "./DataClient";
import { LotrDate } from "./LotrDate";

jest.mock(
  "./datasets/characters.json",
  () => [
    {
      id: 1,
      name: "SomeCoolCharacter",
      events: [1, 2, 3],
    },
  ],
  { virtual: true }
);

jest.mock(
  "./datasets/events.json",
  () => [
    {
      id: 1,
      name: "A Major Event",
      place: 1,
      date: "22 Sept 3001",
      chapter: 1,
      description: "Some Description of major event",
    },
    {
      id: 2,
      name: "A Minor Event",
      place: 2,
      date: "30 Sept 3001",
      chapter: 2,
      description: "Some Description of minor event",
    },
    {
      id: 4,
      name: "A Minor Event 2",
      place: 2,
      date: "30 Sept 3001",
      chapter: 2,
      description: "Some Description of minor event 2",
    },
    {
      id: 3,
      name: "A Minor Event Out of Order",
      place: 3,
      date: "1 Jan 3001",
      chapter: 3,
      description: "This event is out of order",
    },
  ],
  { virtual: true }
);

jest.mock(
  "./datasets/places.json",
  () => [
    {
      id: 1,
      name: "Rivendell",
      x: 543,
      y: 123,
    },
    {
      id: 2,
      name: "Mines of Moria",
      x: 1200,
      y: 456,
    },
    {
      id: 3,
      name: "Rohan",
      x: 1400,
      y: 765,
    },
  ],
  { virtual: true }
);

let dataClient;

beforeEach(() => {
  dataClient = new DataClient();
});

describe("getCharacterBy()", () => {
  it("throws an error for undefined attributes", () => {
    expect(() => dataClient.getCharacterBy("badAttribute", 2)).toThrowError(
      `"badAttribute" is not a valid search field`
    );
  });

  it("throws an error when the attribute is the wrong type", () => {
    expect(() => dataClient.getCharacterBy("id", "badId")).toThrowError("(badId) is not a valid value for id");
  });

  it("throws an error when there is no character returned with that attribute", () => {
    expect(() => dataClient.getCharacterBy("id", -1)).toThrowError(`Could not find character with id = -1`);
  });

  it("finds character objects by id", () => {
    const character = dataClient.getCharacterBy("id", 1);

    expect(character.name).toEqual("SomeCoolCharacter");
  });

  it("finds character objects by name", () => {
    const character = dataClient.getCharacterBy("name", "SomeCoolCharacter");

    expect(character.id).toEqual(1);
  });
});

describe("getEventBy()", () => {
  it("throws an error for undefined attributes", () => {
    expect(() => dataClient.getEventBy("badAttribute", 2)).toThrowError(`"badAttribute" is not a valid search field`);
  });

  it("throws an error when the attribute is the wrong type", () => {
    expect(() => dataClient.getEventBy("id", "badId")).toThrowError("(badId) is not a valid value for id");
  });

  it("throws an error when there is no event returned with that attribute", () => {
    expect(() => dataClient.getEventBy("id", -1)).toThrowError(`Could not find event with id = -1`);
  });

  it("finds event objects by id", () => {
    const event = dataClient.getEventBy("id", 1);

    expect(event.name).toEqual("A Major Event");
  });

  it("finds event objects by name", () => {
    const event = dataClient.getEventBy("name", "A Major Event");

    expect(event.id).toEqual(1);
  });
});

describe("getPlaceBy()", () => {
  it("throws an error for undefined attributes", () => {
    expect(() => dataClient.getPlaceBy("badAttribute", 2)).toThrowError(`"badAttribute" is not a valid search field`);
  });

  it("throws an error when the attribute is the wrong type", () => {
    expect(() => dataClient.getPlaceBy("id", "badId")).toThrowError("(badId) is not a valid value for id");
  });

  it("throws an error when there is no place returned with that attribute", () => {
    expect(() => dataClient.getPlaceBy("id", -1)).toThrowError(`Could not find place with id = -1`);
  });

  it("finds place objects by id", () => {
    const place = dataClient.getPlaceBy("id", 1);

    expect(place.name).toEqual("Rivendell");
  });

  it("finds place objects by name", () => {
    const place = dataClient.getPlaceBy("name", "Rivendell");

    expect(place.id).toEqual(1);
  });
});

describe("getEventsById()", () => {
  it("throws an error if there are non-integer ids", () => {
    expect(() => dataClient.getEventsById([1, null])).toThrowError("Received some invalid eventIds: (1,)");
  });

  it("returns a list of event objects", () => {
    const events = dataClient.getEventsById([1]);

    expect(events[0]).toEqual(
      expect.objectContaining({
        id: 1,
        name: "A Major Event",
        date: "22 Sept 3001",
      })
    );
  });
});

describe("createTimeline()", () => {
  let characterEvents;

  beforeEach(() => {
    const character = dataClient.getCharacterBy("id", 1);
    characterEvents = dataClient.getEventsById(character.events);
  });

  it("joins events with places data", () => {
    const timeline = dataClient.createTimeline(characterEvents, "lotrDateValue");
    expect(timeline).toEqual([
      {
        lotrDate: "1 Jan 3001",
        lotrDateValue: 30010101,
        description: "This event is out of order",
        chapter: 3,
        eventId: 3,
        placeId: 3,
        eventName: "A Minor Event Out of Order",
        x: 1400,
        y: 765,
      },
      {
        lotrDate: "22 Sept 3001",
        lotrDateValue: 30010922,
        description: "Some Description of major event",
        eventId: 1,
        placeId: 1,
        chapter: 1,
        eventName: "A Major Event",
        x: 543,
        y: 123,
      },
      {
        lotrDate: "30 Sept 3001",
        lotrDateValue: 30010930,
        description: "Some Description of minor event",
        eventId: 2,
        placeId: 2,
        chapter: 2,
        eventName: "A Minor Event",
        x: 1200,
        y: 456,
      },
    ]);
  });

  it("can sort timeline by chapters", () => {
    const timeline = dataClient.createTimeline(characterEvents, "sorting");
    expect(timeline).toEqual([
      expect.objectContaining({ chapter: 1 }),
      expect.objectContaining({ chapter: 2 }),
      expect.objectContaining({ chapter: 3 }),
    ]);
  });
});

describe("getCharacterTimelineBy()", () => {
  it("creates a timeline of all the character events", () => {
    expect(dataClient.getCharacterTimelineBy("id", 1, "lotrDateValue")).toEqual([
      {
        lotrDate: "1 Jan 3001",
        lotrDateValue: 30010101,
        description: "This event is out of order",
        eventId: 3,
        placeId: 3,
        chapter: 3,
        eventName: "A Minor Event Out of Order",
        x: 1400,
        y: 765,
      },
      {
        lotrDate: "22 Sept 3001",
        lotrDateValue: 30010922,
        description: "Some Description of major event",
        eventId: 1,
        placeId: 1,
        chapter: 1,
        eventName: "A Major Event",
        x: 543,
        y: 123,
      },
      {
        lotrDate: "30 Sept 3001",
        lotrDateValue: 30010930,
        description: "Some Description of minor event",
        eventId: 2,
        placeId: 2,
        chapter: 2,
        eventName: "A Minor Event",
        x: 1200,
        y: 456,
      },
    ]);
  });
});

describe("getDistinctDates()", () => {
  it("returns a sorted list of distinct event dates", () => {
    expect(dataClient.getDistinctDates()).toEqual([
      new LotrDate("1 Jan 3001"),
      new LotrDate("22 Sept 3001"),
      new LotrDate("30 Sept 3001"),
    ]);
  });
});
