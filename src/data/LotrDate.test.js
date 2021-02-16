import { LotrDate } from "./LotrDate";

describe("LotrDate", () => {
  const examples = [
    ["22 Sept 3001", 30010922],
    ["12 Apr 3018", 30180412],
    ["20 Oct 3018", 30181020],
    ["14 Jan 3019", 30190114],
    ["3001", 30010000],
  ];
  for (const [dateString, expected] of examples) {
    it("parses lotr date strings into sortable integer values", () => {
      const lotrDate = new LotrDate(dateString);
      expect(lotrDate.value).toEqual(expected);
      expect(lotrDate.lotrDateString).toEqual(dateString);
    });
  }
});
