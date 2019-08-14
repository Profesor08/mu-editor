import refinery from "./items-data/refinery";

export class Refinery {
  static getOptions(item) {
    if (refinery[item.group] && refinery[item.group][item.id]) {
      return refinery[item.group][item.id];
    }

    return ["Unknown refinery option"];
  }
}
