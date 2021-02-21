export class LotrDate {
  constructor(lotrDate) {
    if (typeof lotrDate === "string") {
      this.lotrDateString = lotrDate;
      this.value = this.parseLotrDateString(lotrDate);
    } else if (typeof lotrDate === "number") {
      this.value = lotrDate;
      this.lotrDateString = this.createLotrDateString(lotrDate);
    }
  }

  parseLotrDateString(lotrDateString) {
    if (!lotrDateString) {
      console.log(lotrDateString);
    }
    const match = lotrDateString.match(/(\d+) ([A-z]+) (\d+)/);
    if (!match) {
      // Handle case where only year given
      return Number(lotrDateString) * 10000;
    }
    const [, day, month, year] = match;
    return Number(day) + this.monthToNumber(month) * 100 + Number(year) * 10000;
  }

  createLotrDateString(value) {
    let day = value % 100;
    value = Math.floor(value / 100);
    let month = value % 100;
    value = Math.floor(value / 100);
    let year = value;

    let values = [];
    if (day > 0) values.push(day);
    if (month > 0) values.push(this.numberToMonth(month));
    if (year > 0) values.push(year);

    return values.join(" ");
  }

  monthToNumber(monthStr) {
    switch (true) {
      case /Jan|January/i.test(monthStr):
        return 1;
      case /Feb|February/i.test(monthStr):
        return 2;
      case /Mar|March/i.test(monthStr):
        return 3;
      case /Apr|April/i.test(monthStr):
        return 4;
      case /May/i.test(monthStr):
        return 5;
      case /Jun|June/i.test(monthStr):
        return 6;
      case /Jul|July/i.test(monthStr):
        return 7;
      case /Aug|August/i.test(monthStr):
        return 8;
      case /Sep|Sept|September/i.test(monthStr):
        return 9;
      case /Oct|October/i.test(monthStr):
        return 10;
      case /Nov|November/i.test(monthStr):
        return 11;
      case /Dec|December/i.test(monthStr):
        return 12;
      default:
        throw new Error(`Received invalid month string: ${monthStr}`);
    }
  }

  numberToMonth(monthNumber) {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthNumber - 1];
  }

  toString() {
    return this.lotrDateString;
  }
}
