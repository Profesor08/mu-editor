let classes = {
  DarkWizard: {
    "1": "Dark Wizard",
    "2": "Soul Master",
    "3": "Grand Master",
  },
  DarkKnight: {
    "1": "Dark Knight",
    "2": "Blade Knight",
    "3": "Blade Master",
  },
  FairyElf: {
    "1": "Fairy Elf",
    "2": "Muse Elf",
    "3": "High Elf",
  },
  MagicGladiator: {
    "1": "Magic Gladiator",
    "2": "Duel Master",
    "3": "Duel Master",
  },
  DarkLord: {
    "1": "Dark Lord",
    "2": "Lord Emperor",
    "3": "Lord Emperor",
  },
  Summoner: {
    "1": "Summoner",
    "2": "Bloody Summoner",
    "3": "Dimension Master",
  },
  RageFighter: {
    "1": "Rage Fighter",
    "2": "Fists Master",
    "3": "Fists Master",
  },
  GrowLancer: {
    "1": "Grow Lancer",
    "2": "Grow Lancer",
    "3": "Mirage Lancer",
  },
};

export class CharacterClass {
  constructor() {}

  static get classes() {
    return classes;
  }

  static getCharacterClass(classCode) {
    throw `Not implemented, passed data [classCode: ${classCode}]`;
  }

  /**
   * Check if item is available fo all classes
   * @param item
   */
  static isItemAvailableForAllClasses(item) {
    for (let characterClass in this.classes) {
      if (item.data[characterClass] === 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get list of classes available to wear item
   * @param item
   */
  static getItemEquipClass(item) {
    let classes = [];

    for (let characterClass in this.classes) {
      if (item.data[characterClass] > 0) {
        classes.push(this.classes[characterClass][item.data[characterClass]]);
      }
    }

    return classes;
  }
}
