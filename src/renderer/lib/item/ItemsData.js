import data from "./items-data/itemData.json";

export class ItemsData {
  static getItemData(item) {
    return data[item.group][item.id];
  }

  static getGroup(id) {
    return data[id];
  }

  static getItem(group, id) {
    return data[group][id];
  }
}
