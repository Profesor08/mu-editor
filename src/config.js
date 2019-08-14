const characterClasses = {
  dw: {
    classCodes: [0, 1, 2, 3],
    nameClasses: "DW/SM/GM",
    classGroupName: "Strongest Mages",
    className: {
      0: "Dark Wizard",
      1: "Soul Master",
      2: "Grand Master",
      3: "Soul Wizard",
    },
  },
  dk: {
    classCodes: [16, 17, 18, 19],
    nameClasses: "DK/BK/BM",
    classGroupName: "Strongest Knights",
    className: {
      16: "Dark Knight",
      17: "Blade Knight",
      18: "Blade Master",
      19: "Dragon Knight",
    },
  },
  fe: {
    classCodes: [32, 33, 34, 35],
    nameClasses: "FE/ME/HE",
    classGroupName: "Strongest Elf's",
    className: {
      32: "Fairy Elf",
      33: "Muse Elf",
      34: "High Elf",
      35: "Noble Elf",
    },
  },
  mg: {
    classCodes: [48, 49, 50, 51],
    nameClasses: "MG/DM",
    classGroupName: "Strongest Gladiators",
    className: {
      48: "Magic Gladiator",
      49: "Duel Master",
      50: "Magic Knight",
    },
  },
  dl: {
    classCodes: [64, 65, 66, 67],
    nameClasses: "DL/LM",
    classGroupName: "Strongest Lords",
    className: {
      64: "Dark Lord",
      65: "Lord Emperor",
      66: "Empire Lord",
    },
  },
  sum: {
    classCodes: [80, 81, 82, 83],
    nameClasses: "SUM/BS/DM",
    classGroupName: "Strongest Summoners",
    className: {
      80: "Summoner",
      81: "Bloody Summoner",
      82: "Dimension Master",
      83: "Dimension Summoner",
    },
  },
  rf: {
    classCodes: [96, 97, 98, 99],
    nameClasses: "SUM/BS/DM",
    classGroupName: "Strongest Fighters",
    className: {
      96: "Rage Fighter",
      97: "Fists Master",
      98: "Fists Master",
      99: "Fist Blazer",
    },
  },
  gl: {
    classCodes: [112, 113, 114, 115],
    nameClasses: "GL/ML",
    classGroupName: "Strongest Lancers",
    className: {
      112: "Grow Lancer",
      113: "Grow Lancer",
      114: "Mirage Lancer",
      115: "Shining Lancer",
    },
  },
};

const characterClassName = {};

for (let prop in characterClasses) {
  const charClass = characterClasses[prop];

  charClass.classCodes.forEach(code => {
    characterClassName[code] = {
      name: charClass.className[code],
      short: prop,
    };
  });
}

const charClass = {
  0: "Dark Wizard",
  1: "Soul Master",
  2: "Grand Master",
  3: "Soul Wizard",
  16: "Dark Knight",
  17: "Blade Knight",
  18: "Blade Master",
  19: "Dragon Knight",
  32: "Fairy Elf",
  33: "Muse Elf",
  34: "High Elf",
  35: "Noble Elf",
  48: "Magic Gladiator",
  49: "Duel Master",
  50: "Magic Knight",
  64: "Dark Lord",
  65: "Lord Emperor",
  66: "Empire Lord",
  80: "Summoner",
  81: "Bloody Summoner",
  82: "Dimension Master",
  83: "Dimension Summoner",
  96: "Rage Fighter",
  97: "Fists Master",
  98: "Fists Master",
  99: "Fist Blazer",
  112: "Grow Lancer",
  113: "Grow Lancer",
  114: "Mirage Lancer",
  115: "Shining Lancer",
};

export class CharClass {
  static byCode(code) {
    const name = charClass[code];

    if (name) {
      return name;
    }

    return "Unknown";
  }
}
