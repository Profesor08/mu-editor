import Magical from "./items-data/harmony/Magical";
import Physical from "./items-data/harmony/Physical";
import Defensive from "./items-data/harmony/Defensive";

export class Harmony {
  static getOptions(item) {
    try {
      const options = Harmony.getGroupOptions(item.group);

      const option = options.find(option => option.index === item.harmony_type);

      if (option) {
        const effect = options[item.harmony_type].effects[item.harmony_level];

        return [
          {
            name: option.name.replace("%d", effect.value),
            price: effect.price,
          },
        ];
      }
    } catch (err) {
      console.warn(err);
    }

    return [
      {
        name: `Unknown harmony option [${item.harmony_type}][${
          item.harmony_level
        }]`,
        price: -1,
      },
    ];
  }

  static getAvailableItemOptions(item) {
    return Harmony.getAvailableOptions(item.group, item.id);
  }

  static getAvailableOptions(group, id) {
    return Harmony.getGroupOptions(group);
  }

  static getGroupOptions(group) {
    if (group === 5) {
      return Magical;
    } else if (group >= 6 && group <= 11) {
      return Defensive;
    } else {
      return Physical;
    }
  }
}
