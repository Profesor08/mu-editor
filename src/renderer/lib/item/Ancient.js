const itemSetOption = require("./items-data/ancient-data/itemSetOption");
const itemSetType = require("./items-data/ancient-data/itemSetType");
const itemOptionName = require("./items-data/ancient-data/itemOptionName");
const itemStats = require("./items-data/ancient-data/itemStats");

export class Ancient {
  /**
   * Get Item Set id
   * @param {Item} item
   * @return int
   */
  static getSetId(item) {
    if (itemSetType[item.group][item.id]) {
      switch (item.ancient) {
        case 5:
          return itemSetType[item.group][item.id]["TierI"];
        case 6:
          return itemSetType[item.group][item.id]["TierII"];
        case 9:
          return itemSetType[item.group][item.id]["TierI"];
        case 10:
          return itemSetType[item.group][item.id]["TierII"];
      }
    }

    throw `Item set [${item.ancient}] not exists.`;
  }

  /**
   * Get Item Set name
   * @param {Item} item
   */
  static getSetName(item) {
    try {
      let setId = this.getSetId(item);

      return itemSetOption[setId]["Name"];
    } catch (err) {
      return "Unknown";
    }
  }

  /**
   * Get Item Set Options List
   * @param {Item} item
   * @return []
   */
  static getSetOptions(item) {
    let setId = this.getSetId(item);
    let data = itemSetOption[setId];
    let options = [];

    try {
      for (let i = 1; i <= 6; i++) {
        if (data[`OptIdx1_${i}`] !== -1) {
          options.push(
            this.getOptionName(data[`OptIdx1_${i}`], data[`OptVal1_${i}`]),
          );
        }
        if (data[`OptIdx2_${i}`] !== -1) {
          options.push(
            this.getOptionName(data[`OptIdx2_${i}`], data[`OptVal2_${i}`]),
          );
        }
      }

      for (let i = 1; i <= 5; i++) {
        if (data[`FullOptIdx${i}`] !== -1) {
          options.push(
            this.getOptionName(data[`FullOptIdx${i}`], data[`FullOptVal${i}`]),
          );
        }
      }
    } catch (err) {
      console.warn(err);
    }

    return options;
  }

  static getOptionName(optId, optVal) {
    try {
      return itemOptionName[optId].replace("%s", optVal);
    } catch (err) {
      return `Unknown option: ${optId}, value: ${optVal}`;
    }
  }

  /**
   * Get Item Set addition Stats name
   * @param {Item} item
   */
  static getStats(item) {
    let value = (item.ancient >> 2) & 3;

    if (item.data["SetAttrib"] === 6) {
      value = Math.floor(value * 7.5);
    } else {
      value = Math.floor(value * 5);
    }

    switch (item.data["SetAttrib"]) {
      case 1:
        return [`Increase strength +${value}`];
      case 2:
        return [`Increase agility +${value}`];
      case 3:
        return [`Increase energy +${value}`];
      case 4:
        return [`Increase stamina +${value}`];
      case 6:
        return [`Increase all stats by ${value}`];
    }

    return [];
  }
}
