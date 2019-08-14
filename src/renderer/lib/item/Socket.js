import sockets from "./items-data/sockets";

export const formula = type => {
  switch (type) {
    case 0:
      return x => `${x}`;
    case 1:
      return x => `${x}`;
    case 2:
      return x => `${x}%`; // There must be some magic calculation, but .|.
    case 3:
      return x => `(Level / ${x})`; // There must be some magic calculation, but .|.
    case 4:
      return x => `(HP / ${x})`; // There must be some magic calculation, but .|.
    case 5:
      return x => `(MP / ${x})`; // There must be some magic calculation, but .|.
  }

  return x => x;
};

export const element = elementType => {
  switch (elementType) {
    case 1:
      return "Fire";
    case 2:
      return "Water";
    case 3:
      return "Ice";
    case 4:
      return "Wind";
    case 5:
      return "Lightening";
    case 6:
      return "Earth";
  }

  return "";
};

export class Socket {
  /**
   * Get item socket options
   * @param item
   * @return {Array}
   */
  static getOptions(item) {
    let options = [];

    if (this.isSocketItem(item) && this.itemHasSockets(item)) {
      for (let i = 0; i < 5; i++) {
        if (item.sockets[i] === 254) {
          options.push({
            name: `Socket ${i + 1}: No item application`,
            code: item.sockets[i],
          });
        } else if (item.sockets[i] !== 255) {
          let seedIndex = item.sockets[i] % 50;
          let sphereLevel = (item.sockets[i] - seedIndex) / 50 + 1;

          try {
            let option = this.getSocketOption(seedIndex);
            let name = option["Name"];
            let value = formula(option["BonusType"])(
              option[`BonusValue${sphereLevel}`],
              sphereLevel,
            );

            options.push({
              name: `Socket ${i + 1}: [Level ${sphereLevel}] ${element(
                option["ElementType"],
              )} (${name} +${value})`,
              index: seedIndex,
              level: sphereLevel,
              code: item.sockets[i],
            });
          } catch (err) {
            options.push({
              name: `Socket ${i + 1}: Unknown socket option: ${
                item.sockets[i]
              }`,
              index: seedIndex,
              level: sphereLevel,
              code: item.sockets[i],
            });
          }
        }
      }
    }

    return options;
  }

  /**
   * Get socket option info by Index
   * @param seedIndex
   */
  static getSocketOption(seedIndex) {
    for (let i = 0; i < sockets.SocketItemOptionSettings.length; i++) {
      if (sockets.SocketItemOptionSettings[i]["Index"] === seedIndex) {
        return sockets.SocketItemOptionSettings[i];
      }
    }
  }

  /**
   * Get item socket bonus options
   * @param item
   * @return {Array}
   */
  static getBonusSocketOption(item) {
    let options = [];

    let id = item._bytes[10] % 6;

    try {
      let option = sockets.SocketBonusSettings[id];

      options.push({
        name: option.Name,
        value: option.BonusValue,
      });
    } catch (err) {}

    return options;
  }

  /**
   * Check if item has mounted sockets
   * @param {Item} item
   * @return {boolean}
   */
  static itemHasSockets(item) {
    for (let i = 0; i < 5; i++) {
      if (item.sockets !== 255) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if item can have sockets
   * @param {Item} item
   * @return {boolean}
   */
  static isSocketItem(item) {
    return item.data["Type"] === 2;
  }

  static getAvailableSocketOptions() {
    return sockets.SocketItemOptionSettings;
  }
}
