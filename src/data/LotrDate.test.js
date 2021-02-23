import { LotrDate } from "./LotrDate";

describe("LotrDate", () => {
  const examples = [
    ["22 Sep 3001", 30010922],
    ["12 Apr 3018", 30180412],
    ["20 Oct 3018", 30181020],
    ["14 Jan 3019", 30190114],
    ["Jul 3018", 30180700],
    ["3001", 30010000],
  ];
  for (const [dateString, expected] of examples) {
    it(`parses "${dateString}" into sortable integer value ${expected}`, () => {
      const lotrDate = new LotrDate(dateString);
      expect(lotrDate.value).toEqual(expected);
      expect(lotrDate.lotrDateString).toEqual(dateString);
    });
  }

  for (const [expected, dateValue] of examples) {
    it(`parses "${dateValue}" into lotr date ${expected}`, () => {
      const lotrDate = new LotrDate(dateValue);
      expect(lotrDate.lotrDateString).toEqual(expected);
    });
  }
});
