import { DataClient } from "./DataClient";

jest.mock(
  "./characters.json",
  () => [
    {
      id: 1,
      name: "SomeCoolCharacter",
      events: [1, 2, 3, 4],
    },
  ],
  { virtual: true }
);

jest.mock(
  "./events.json",
  () => [
    {
      id: 1,
      name: "A Major Event",
      place: 1,
      date: "22 Sept 3001",
      chapter: 1,
      description: "Some Description",
    },
  ],
  { virtual: true }
);

jest.mock(
  "./places.json",
  () => [
    {
      id: 1,
      name: "Rivendell",
      x: 543,
      y: 123,
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


