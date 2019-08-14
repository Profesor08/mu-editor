import excellent from "./items-data/excellent";

const formula = id => {
  switch (id) {
    case 0:
      return x => (x / 2) * 0.03 * (x / 20);
    case 1:
      return x => x / 3 + (x - 150);
    case 2:
      return x => x * 1.1;
    case 3:
      return x => x * 1.1;
    case 4:
      return x => x * 0.3;
    case 5:
      return x => x / 3.5;
  }

  return x => x;
};

export class Excellent {
  /**
   * Get item excellent options
   * @param {Item} item
   */
  static getOptions(item) {
    let availableExcOpts = this.getAvailableOptions(item);
    let activeOptions = this.getActiveOptions(item, availableExcOpts);

    return this.getOptionsText(item, activeOptions);
  }

  /**
   * Get available excellent option on item
   * @param {Item} item
   * @param availableExcOpts
   */
  static getActiveOptions(item, availableExcOpts) {
    let activeOptions = [];

    availableExcOpts.forEach(function(option) {
      let active = false;

      if (option.Number < 6) {
        active =
          (item.excellent & (1 << (5 - option.Number))) ===
          1 << (5 - option.Number);
      } else {
        active =
          item.sockets[0] === option.Number ||
          item.sockets[1] === option.Number ||
          item.sockets[2] === option.Number ||
          item.sockets[3] === option.Number ||
          item.sockets[4] === option.Number;
      }

      if (active) {
        activeOptions.push(option);
      }
    });

    return activeOptions;
  }

  /**
   * Getting available excellent options for selected item
   * @param {Item} item
   */
  static getAvailableOptions(item) {
    if (item.data["KindA"] === 6) {
      return this.getAvailableWingsOptions(item.data["KindB"]);
    } else {
      return this.getAvailableCommonOptions(item.data["KindA"]);
    }
  }

  /**
   * Get available excellent option for common items
   * @param kindA - item KindA
   * @return {Array}
   */
  static getAvailableCommonOptions(kindA) {
    let availableExcOpts = [];

    excellent.Common.forEach(function(option) {
      if (option["ItemKindA_1"] === kindA || option["ItemKindA_2"] === kindA) {
        availableExcOpts.push(option);
      }
    });

    return availableExcOpts;
  }

  /**
   * Get available excellent option for wings
   * @param kindB
   * @return {Array}
   */
  static getAvailableWingsOptions(kindB) {
    let availableExcOpts = [];

    excellent.Wings.forEach(function(option) {
      if (option["ItemKindB"] === kindB) {
        availableExcOpts.push(option);
      }
    });

    return availableExcOpts;
  }

  /**
   * Get excellent options text
   * @param {Item} item
   * @param options
   */
  static getOptionsText(item, options) {
    return options.map(option => {
      return this.getOptionText(item, option);
    });
  }

  static getOptionText(item, option) {
    let value = this.getOptionValue(option);
    let effect = this.getOptionEffect(item, option);

    return option["Name"].replace(/%d[%]{0,1}/, value).replace("%s", effect);
  }

  /**
   * Get option value
   * @param option
   * @return {*}
   */
  static getOptionValue(option) {
    if (option["Operator"] === 100 && option["FormulaID"] >= 0) {
      return formula(option["FormulaID"])(option["Value"]);
    } else {
      return option["Value"];
    }
  }

  /**
   * Get option effect
   * @param {Item} item
   * @param option
   */
  static getOptionEffect(item, option) {
    let effect;

    try {
      if (item.data["KindA"] === 6) {
        effect = excellent.WingOptionEffect[option["ID"]];
      } else {
        effect = excellent.CommonOptionEffect[option["ID"]];
      }

      if (effect["Rate"] === 1) {
        return "ATK Rate";
      }

      if (effect["Attack"] === 1) {
        if (item.data["MagicPower"] > 0) {
          return "WIZ Dmg";
        } else {
          return "ATK Dmg";
        }
      }

      if (effect["Defense"] === 1) {
        return "Defense";
      }

      if (effect["Life"] === 1) {
        return "Life";
      }

      if (effect["Mana"] === 1) {
        return "Mana";
      }
    } catch (err) {}

    return "Unknown effect";
  }
}
