const fs = require("fs-extra");
const path = require("path");

import elemental from "./items-data/elemental";

import { ItemsData } from "./ItemsData";
import { CharacterClass } from "./CharacterClass";
import { Ancient } from "./Ancient";
import { Refinery } from "./Refinery";
import { Harmony } from "./Harmony";
import { Skill } from "./Skill";
import { Excellent } from "./Excellent";
import { Socket } from "./Socket";

import { numberToBytesArray32, bytesArrayToNumber } from "../../lib/math";

export class Item {
  constructor(bytes) {
    this._bytes = bytes;

    // item id
    this._id = Math.floor((bytes[7] >= 128 ? 256 : 0) + bytes[0]);

    // item group
    this._group = Math.floor(bytes[9] / 16);

    // item data
    this._data = ItemsData.getItemData(this);

    // item skill
    this._skill = 0;
    let opt = bytes[1];
    if (opt >= 128) {
      opt -= 128;
      this._skill = 1;
    }

    // item level
    this._level = Math.floor(opt / 8);

    // item luck
    this._luck = 0;
    opt = Math.floor(opt % 8);
    if (opt > 3) {
      opt -= 4;
      this._luck = 1;
    }

    // item excl
    this._excellent = 0;
    this._excellent_options = [];
    let ex = bytes[7];
    if (ex >= 128) {
      ex -= 128;
    }
    if (ex > 63) {
      ex -= 64;
      opt += 4;
    }
    if (ex >= 32) {
      ex -= 32;
      this._excellent += 32;
      this._excellent_options.push(32);
    }
    if (ex >= 16) {
      ex -= 16;
      this._excellent += 16;
      this._excellent_options.push(16);
    }
    if (ex >= 8) {
      ex -= 8;
      this._excellent += 8;
      this._excellent_options.push(8);
    }
    if (ex >= 4) {
      ex -= 4;
      this._excellent += 4;
      this._excellent_options.push(4);
    }
    if (ex >= 2) {
      ex -= 2;
      this._excellent += 2;
      this._excellent_options.push(2);
    }
    if (ex >= 1) {
      ex -= 1;
      this._excellent += 1;
      this._excellent_options.push(1);
    }

    // item opt
    this._option = opt + ex;

    // item durability
    this._durability = bytes[2];

    // item harmony
    this._harmony_type = Math.floor(bytes[10] / 16);
    this._harmony_level = Math.floor(bytes[10] % 16);
    if (this._harmony_type === 15) {
      this._harmony_type = 0;
    }
    if (this._harmony_level === 15) {
      this._harmony_level = 0;
    }
    // item refinery
    this._refinery = bytes[9] % 16 !== 0;

    // item sockets
    this._sockets = [bytes[11], bytes[12], bytes[13], bytes[14], bytes[15]];

    // item ancient
    this._ancient = bytes[8];

    // item pentagram
    this._is_pentagram = false;
    try {
      if (this.data["KindB"] === 43) {
        this._is_pentagram = true;
      }
    } catch (err) {}

    // item errtel
    this._is_errtel = false;
    try {
      if (this.data["KindB"] === 44) {
        this._is_errtel = true;
      }
    } catch (err) {}

    // serial
    this._serial1 = bytesArrayToNumber([
      bytes[3],
      bytes[4],
      bytes[5],
      bytes[6],
    ]);

    this._serial2 = bytesArrayToNumber([
      bytes[16],
      bytes[17],
      bytes[18],
      bytes[19],
    ]);

    this._displayLevel = true;
  }

  static createItemBytes(item) {
    const bytes = []
      .concat(new Array(11).fill(0))
      .concat(new Array(5).fill(255))
      .concat(new Array(16).fill(255));

    // const item = {
    //   ...itemObj,
    //   ancient: { ...itemObj.ancient },
    //   serial: { ...itemObj.serial },
    //   excellent: [...(itemObj.excellent || [])],
    // };

    // id
    if (item.id >= 256) {
      bytes[0] = item.id - 256;
      bytes[7] += 128;
    } else {
      bytes[0] = item.id;
    }

    // group
    bytes[9] = Math.floor(item.group * 16);

    // level
    bytes[1] = item.level * 8;

    // option
    if (item.option >= 4) {
      bytes[7] += 64;
      bytes[1] += item.option - 4;
    } else {
      bytes[1] += item.option;
    }

    // luck
    if (item.luck === true) {
      bytes[1] += 4;
    }

    // skill
    if (item.skill === true) {
      bytes[1] += 128;
    }

    // refinery
    if (item.refinery === true) {
      bytes[9] += 8;
    }

    // durability
    bytes[2] = item.durability;

    // serial
    const serial1 = numberToBytesArray32(item.serial.value1);
    const serial2 = numberToBytesArray32(item.serial.value2);

    bytes[3] = serial1[0];
    bytes[4] = serial1[1];
    bytes[5] = serial1[2];
    bytes[6] = serial1[3];
    bytes[16] = serial2[0];
    bytes[17] = serial2[1];
    bytes[18] = serial2[2];
    bytes[19] = serial2[3];

    // excellent

    item.excellent.forEach(option => {
      bytes[7] += Math.pow(2, 5 - option);
    });

    // ancient
    bytes[8] = item.ancient.set + item.ancient.level;
    // console.log(item.ancient);

    // harmony
    bytes[10] = item.harmony.option * 16 + item.harmony.level;
    // bytes[10] = 1;

    // sockets
    item.sockets.forEach((socket, id) => {
      bytes[11 + id] = socket;
    });

    return bytes;
  }

  get bytes() {
    return this._bytes;
  }

  get displayLevel() {
    return this._displayLevel;
  }

  get id() {
    return this._id;
  }

  get group() {
    return this._group;
  }

  get data() {
    return this._data;
  }

  get luck() {
    return this._luck;
  }

  get level() {
    return this._level;
  }

  get skill() {
    return this._skill;
  }

  get ancient() {
    return this._ancient;
  }

  get sockets() {
    return this._sockets;
  }

  get refinery() {
    return this._refinery;
  }

  get harmony_level() {
    return this._harmony_level;
  }

  get harmony_type() {
    return this._harmony_type;
  }

  get durability() {
    return this._durability;
  }

  get option() {
    return this._option;
  }

  get excellent_options() {
    return this._excellent_options;
  }

  get excellent() {
    return this._excellent;
  }

  get is_errtel() {
    return this._is_errtel;
  }

  get is_pentagram() {
    return this._is_pentagram;
  }

  isEmpty() {
    return !this.data;
  }

  isPentagramItem() {
    return this._is_pentagram;
  }

  isErrtelItem() {
    return this._is_errtel;
  }

  isSocketItem() {
    try {
      return this.data["Type"] === 2;
    } catch (err) {
      return false;
    }
  }

  itemType(group, id) {
    return group * 512 + id;
  }

  async getImageFilePath(imagePath) {
    try {
      const fileExists = await fs.exists(`${process.cwd()}/${imagePath}.gif`);

      if (fileExists) {
        return `${imagePath}.gif`;
      }
    } catch (err) {}

    throw "Image not exists.";
  }

  async getImage() {
    let imagesDir = `static/images/items`;

    try {
      if (this._is_errtel || this._is_pentagram) {
        let element = this._bytes[10] % 16;

        if (element === 0) {
          return await this.getImageFilePath(
            imagesDir + `/` + this._group + `/` + this._id,
          );
        } else {
          return await this.getImageFilePath(
            imagesDir + `/` + this._group + `/` + this._id + `-` + element,
          );
        }
      } else {
        try {
          if (this._group <= 11 || this._level === 0) {
            return await this.getImageFilePath(
              imagesDir + `/` + this._group + `/` + this._id,
            );
          } else {
            return await this.getImageFilePath(
              imagesDir +
                `/` +
                this._group +
                `/` +
                this._id +
                `-` +
                this._level,
            );
          }
        } catch (err) {
          return await this.getImageFilePath(
            imagesDir + `/` + this._group + `/` + this._id,
          );
        }
      }
    } catch (err) {}

    return imagesDir + `/` + `__unknown_image_6df789gs6df798b.png`;
  }

  getName() {
    let name = ``;

    if (this.group === 13 && this.id === 31) {
      if (this.level === 1) {
        name = `Spirit of Dark Raven`;
        this._displayLevel = false;
      } else {
        name = `Spirit of Dark Horse`;
        this._displayLevel = false;
      }
    } else if (this.group === 12 && this.id === 26) {
      switch (this.level) {
        case 1:
          name = `Red Crystal`;
          break;
        case 2:
          name = `Blue Crystal`;
          break;
        case 3:
          name = `Dark Crystal`;
          break;
        case 4:
          name = `Box of Treasure`;
          break;
        case 5:
          name = `Box of Surprice`;
          break;
      }
      this._displayLevel = false;
    } else if (this.group === 13 && this.id === 20) {
      if (this.level === 1 || this.level === 2) {
        name = `Ring Of Warrior`;
        switch (this.level) {
          case 1:
            name += ` lvl 40`;
            break;
          case 2:
            name += ` lvl 80`;
            break;
        }
        this._displayLevel = false;
      }
    } else if (this.group === 14 && this.id === 11) {
      switch (this.level) {
        case 1:
          name = `Star`;
          break;
        case 2:
          name = `FireCracker`;
          break;
        case 3:
          name = `Heart of Love`;
          break;
        case 5:
          name = `Silver Medal`;
          break;
        case 6:
          name = `Gold Medal`;
          break;
        case 7:
          name = `Box of Heaven`;
          break;
        case 8:
          name = `Box of Kundun +1`;
          break;
        case 9:
          name = `Box of Kundun +2`;
          break;
        case 10:
          name = `Box of Kundun +3`;
          break;
        case 11:
          name = `Box of Kundun +4`;
          break;
        case 12:
          name = `Box of Kundun +5`;
          break;
        case 13:
          name = `Heart Of Lord`;
          break;
      }
      this._displayLevel = false;
    } else if (this.group === 12 && this.id === 11) {
      switch (this.level) {
        case 0 || ``:
          name = `Summoning Goblin`;
          break;
        case 1:
          name = `Summoning Stone Golem`;
          break;
        case 2:
          name = `Summoning Assassin`;
          break;
        case 3:
          name = `Summoning Bali`;
          break;
        case 4:
          name = `Summoning Soldier`;
          break;
        case 5:
          name = `Summoning Yeti`;
          break;
        case 6:
          name = `Summoning Dark Knight`;
          break;
      }
      this._displayLevel = false;
    } else if (this.group === 12) {
      switch (this.id) {
        case 30:
          if (this.level === 1) {
            name = `Jewel of Bless mix x20`;
          } else if (this.level === 2) {
            name = `Jewel of Bless mix x30`;
          } else {
            name = `Jewel of Bless mix x10`;
          }
          this._displayLevel = false;
          break;
        case 31:
          if (this.level === 1) {
            name = `Jewel of Soul mix x20`;
          } else if (this.level === 2) {
            name = `Jewel of Soul mix x30`;
          } else {
            name = `Jewel of Soul mix x10`;
          }
          this._displayLevel = false;
          break;
        case 136:
          this._displayLevel = false;
          break;
        case 137:
          this._displayLevel = false;
          break;
        case 138:
          this._displayLevel = false;
          break;
        case 139:
          this._displayLevel = false;
          break;
        case 140:
          this._displayLevel = false;
          break;
        case 141:
          this._displayLevel = false;
          break;
        case 142:
          this._displayLevel = false;
          break;
        case 143:
          this._displayLevel = false;
          break;
      }
    } else if (this.group === 13) {
      switch (this.id) {
        case 7:
          if (this.level === 1) {
            name = `Sperman`;
          }
          this._displayLevel = false;
          break;
        case 11:
          if (this.level === 1) {
            name = `Life Stone`;
          } else {
            name = `Guardian`;
          }
          this._displayLevel = false;
          break;
        case 14:
          if (this.level === 1) {
            name = `Crest of Monarch`;
          }
          this._displayLevel = false;
          break;
        case 16:
          this._displayLevel = true;
          break;
        case 17:
          this._displayLevel = true;
          break;
        default:
          this._displayLevel = true;
      }
    } else if (this.group === 14) {
      switch (this.id) {
        case 7:
          if (this.level === 1) {
            name = `Potion of Soul`;
          }
          this._displayLevel = false;
          break;
        case 12:
          if (this.level === 1) {
            name = `Heart`;
          } else if (this.level === 2) {
            name = `Pergamin`;
          }
          this._displayLevel = false;
          break;
        case 21:
          if (this.level === 1) {
            name = `Stone`;
          } else if (this.level === 3) {
            name = `Sing of Lord`;
          }
          this._displayLevel = false;
          break;
        case 32:
          if (this.level === 1) {
            name = `Pink Candy Box`;
          }
          this._displayLevel = false;
          break;
        case 33:
          if (this.level === 1) {
            name = `Orange Candy Box`;
          }
          this._displayLevel = false;
          break;
        case 34:
          if (this.level === 1) {
            name = `Blue Candy Box`;
          }
          this._displayLevel = false;
          break;
      }
    }

    if (name.length === 0) {
      name = this.data["Name"] || "Unknown Item";
    }

    let name_anc = "";

    if (this.ancient) {
      // name_anc = this.getAncientName();
    }

    return (name_anc + " " + name).trim();
  }

  getExcellentText(text_after) {
    if (this.excellent > 0) {
      if (this.group >= 0 && this.group <= 11) {
        return "Excellent" + text_after;
      }

      let rings_pendants = [8, 9, 12, 13, 21, 22, 23, 24, 25, 26, 27, 28];

      if (this.group === 13 && rings_pendants.indexOf(this.id) !== -1) {
        return "Excellent" + text_after;
      }

      return "";
    }

    return "";
  }

  getColorizedName() {
    let name = this.getName();
    let name_class = "name-normal";

    if (this.excellent > 0 && this.group > 11) {
      name_class = "name-special";
    }

    if ((this.option > 0 || this.luck > 0) && this.group < 12) {
      name_class = "name-option";
    }

    if (
      this.option === 0 &&
      this.luck === 0 &&
      this.skill === 0 &&
      this.group < 12 &&
      (this.level === 3 || this.level === 4)
    ) {
      name_class = "name-lvl3";
    }

    if (
      this.option === 0 &&
      this.luck === 0 &&
      this.skill === 0 &&
      this.group < 12 &&
      (this.level === 5 || this.level === 6)
    ) {
      name_class = "name-option";
    }

    if (this.group < 12 && this.level >= 7) {
      name_class = "name-special";
    }

    let rings_pendants = [8, 9, 12, 13, 21, 22, 23, 24, 25, 26, 27, 28];

    if (
      this.excellent > 0 &&
      (this.group < 12 ||
        (this.group === 13 && rings_pendants.indexOf(this.id) !== -1))
    ) {
      name_class = "name-excellent";
    }

    let jewels = [15, 30, 31, 136, 137, 138, 139, 140, 141, 142, 143];

    if (this.group === 12 && jewels.indexOf(this.id) !== -1) {
      name_class = "name-special";
    }

    jewels = [13, 14, 16, 22, 31, 42];

    if (this.group === 14 && jewels.indexOf(this.id) !== -1) {
      name_class = "name-special";
    }

    let wings_array = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      49,
      50,
    ];

    if (
      (this.group === 12 && wings_array.indexOf(this.id) !== -1) ||
      (this.group === 13 && this.id === 30)
    ) {
      name_class = "name-special";
    }

    this.sockets.forEach(function(val) {
      if (val !== 255) {
        name_class = "name-socket";
      }
    });

    let ancient_name = "";

    if (this.ancient !== 0) {
      name_class = "name-ancient";

      ancient_name = Ancient.getSetName(this) + " ";
    }

    let level = "";

    if (this.displayLevel) {
      level = this.level > 0 ? " +" + this.level : "";
    }

    if (this.is_pentagram) {
      name_class = "name-special";
    }

    return `<span class="${name_class}">${this.getExcellentText(
      " ",
    )}${ancient_name}${name}${level}</span>`;
  }

  getAdditionalOption(isShort = false) {
    if (this.option > 0) {
      let dmg = " Dmg";
      let wzdmg = " WzDmg";
      let defrate = " Rate";
      let def = " Def";
      let hp = " HpRec";
      let curse = " Curse";

      if (isShort === false) {
        dmg = " Additional dmg %s";
        wzdmg = "Additional wizardy dmg %s";
        defrate = "Additional defence rate %s%";
        def = "Additional defence %s";
        hp = "HP recovery %s%";
        curse = "Curse";
      }

      if (this.group <= 4) {
        return [this.option * 4, dmg];
      }
      if (this.group === 5) {
        return [this.option * 4, wzdmg];
      }
      if (this.group === 6) {
        return [this.option * 5, defrate];
      }
      if (this.group <= 11) {
        return [this.option * 4, def];
      }
      if (this.group === 12 && this.id === 1) {
        return [this.option * 4, wzdmg];
      }
      // # dw
      if (this.group === 12 && this.id === 2) {
        return [this.option * 4, dmg];
      }
      // # dk
      if (this.group === 12 && this.id === 0) {
        return [this.option, hp];
      }
      // # elf
      if (this.group === 12 && this.id === 3 && this.excellent >= 32) {
        return [this.option, hp];
      }
      // #elf
      if (this.group === 12 && this.id === 3) {
        return [this.option * 4, dmg];
      }
      // #elf
      if (this.group === 12 && this.id === 4 && this.excellent >= 32) {
        return [this.option * 4, wzdmg];
      }
      // #dw
      if (this.group === 12 && this.id === 4) {
        return [this.option, hp];
      }
      // #dw
      if (this.group === 12 && this.id === 5 && this.excellent >= 32) {
        return [this.option * 4, dmg];
      }
      // #dk
      if (this.group === 12 && this.id === 5) {
        return [this.option, hp];
      }
      // #dk
      if (this.group === 12 && this.id === 6 && this.excellent >= 32) {
        return [this.option * 4, dmg];
      }
      // #mg
      if (this.group === 12 && this.id === 6) {
        return [this.option * 4, wzdmg];
      }
      // #mg
      if (this.group === 13 && this.id === 30) {
        return [this.option * 4, dmg];
      }
      // #dl
      if (this.group === 12 && this.id === 37 && this.excellent >= 16) {
        return [this.option * 4, wzdmg];
      }
      // #3rd dw
      if (this.group === 12 && this.id === 43 && this.excellent >= 16) {
        return [this.option * 4, wzdmg];
      }
      // #3rd sum
      let wings_3rd = [36, 37, 38, 39, 40, 43];
      if (
        this.group === 12 &&
        wings_3rd.indexOf(this.id) !== -1 &&
        this.excellent >= 16
      ) {
        return [this.option * 4, dmg];
      }
      // #3rd
      if (this.group === 12 && wings_3rd.indexOf(this.id) !== -1) {
        return [this.option, hp];
      }
      // #3rd
      if (this.group === 12 && this.id === 41) {
        return [this.option * 4, wzdmg];
      }
      // #1st sum
      if (this.group === 12 && this.id === 42 && this.excellent >= 32) {
        return [this.option * 4, wzdmg];
      }
      // #2nd sum
      if (this.group === 12 && this.id === 42) {
        return [this.option * 4, curse];
      }
      // #2nd sum
      if (this.group <= 14) {
        return [this.option, hp];
      }
    }

    return "";
  }

  getInfo() {
    let display = `<div class="mu-item-info">`;

    //item name
    display += `<div class="mu-item-name">${this.getColorizedName()}</div>`;

    if (this._is_pentagram || this._is_errtel) {
      switch (this._bytes[10] % 16) {
        case 1:
          display += `<div class=\"item-errtel-element element-fire\">(Fire Element)</div>`;
          break;
        case 2:
          display += `<div class="item-errtel-element element-water">(Water Element)</div>`;
          break;
        case 3:
          display += `<div class="item-errtel-element element-earth">(Earth Element)</div>`;
          break;
        case 4:
          display += `<div class="item-errtel-element element-wind">(Wind Element)</div>`;
          break;
        case 5:
          display += `<div class="item-errtel-element element-darkness">(Darkness Element)</div>`;
          break;
      }
    }

    // debug info
    display += `<div class="debug-info">`;
    display += `<div>Debug:</div>`;
    display += `<div>group: ${this.group}, id: ${this.id}, level: ${
      this.level
    }</div>`;
    display += `<div>serial1: ${this._serial1}, serial2: ${
      this._serial2
    }</div>`;
    display += `</div>`;

    let ItemLevel = this.data["DropLevel"];

    if (this.excellent > 0) {
      ItemLevel = this.data["DropLevel"] + 25;
    } else {
      if (this.ancient !== 0) {
        ItemLevel = this.data["DropLevel"] + 25;
      }
    }

    let iChaosItem = 0;

    if (this.group === 2 && this.id === 6) {
      iChaosItem = 15;
    } else if (this.group === 5 && this.id === 7) {
      iChaosItem = 25;
    } else if (this.group === 4 && this.id === 6) {
      iChaosItem = 30;
    }

    // weapon damage
    if (this.data.hasOwnProperty("TwoHand")) {
      let DamageMin = this.data["DamageMin"];
      let DamageMax = this.data["DamageMax"];

      if (DamageMax > 0) {
        if (this.ancient > 0 && ItemLevel > 0) {
          DamageMax += (DamageMin * 25) / this.data["DropLevel"] + 5;
          DamageMax += ItemLevel / 40 + 5;
        } else {
          if (this.excellent > 0) {
            if (iChaosItem > 0) {
              DamageMax += iChaosItem;
            } else if (this.data["DropLevel"] > 0) {
              DamageMax += (DamageMin * 25) / this.data["DropLevel"] + 5;
            }
          }
        }

        if (this.is_pentagram) {
          DamageMax += this.level * 3;
        } else {
          DamageMax += this.level * 3;
        }

        if (this.level >= 10) {
          DamageMax += ((this.level - 9) * (this.level - 8)) / 2;
        }
      }

      if (DamageMin > 0) {
        if (this.ancient > 0 && ItemLevel > 0) {
          DamageMin += (DamageMin * 25) / this.data["DropLevel"] + 5;
          DamageMin += ItemLevel / 40 + 5;
        } else {
          if (this.excellent > 0) {
            if (iChaosItem > 0) {
              DamageMin += iChaosItem;
            } else if (this.data["DropLevel"] > 0) {
              DamageMin += (DamageMin * 25) / this.data["DropLevel"] + 5;
            }
          }
        }

        if (this.is_pentagram) {
          DamageMin += this.level * 3;
        } else {
          DamageMin += this.level * 3;
        }

        if (this.level >= 10) {
          DamageMin += ((this.level - 9) * (this.level - 8)) / 2;
        }
      }

      DamageMin = Math.floor(DamageMin);
      DamageMax = Math.floor(DamageMax);

      switch (this.data["TwoHand"]) {
        case 0:
          display += `<div class="items-stats one-handed-attack-power">One handed attack power: ${DamageMin}~${DamageMax}</div>`;
          break;
        case 1:
          display += `<div class="items-stats two-handed-attack-power">Two handed attack power: ${DamageMin}~${DamageMax}</div>`;
          break;
      }
    }

    // attack speed
    if (this.data["AttackSpeed"] && this.data["AttackSpeed"] > 0) {
      display += `<div class="items-stats attack-speed">Attack Speed: ${
        this.data["AttackSpeed"]
      }</div>`;
    }

    // item armor
    if (this.data["Defense"] > 0) {
      let Defense = this.data["Defense"];

      if (this.group >= 6 && this.group < 7) {
        Defense += this.level;

        if (this.ancient !== 0 && ItemLevel !== 0) {
          Defense += (Defense * 20) / ItemLevel + 2;
        }
      } else {
        if (this.ancient !== 0 && ItemLevel !== 0) {
          Defense +=
            (Defense * 12) / this.data["DropLevel"] +
            this.data["DropLevel"] / 5 +
            4;
          Defense += (Defense * 3) / ItemLevel + ItemLevel / 30 + 2;
        } else if (this.excellent > 0) {
          if (this.data["DropLevel"] !== 0) {
            Defense +=
              (Defense * 12) / this.data["DropLevel"] +
              this.data["DropLevel"] / 5 +
              4;
          }
        }

        let _type = this.itemType(this.group, this.id);

        if (
          (_type >= this.itemType(12, 36) && _type <= this.itemType(12, 40)) ||
          _type === this.itemType(12, 43) ||
          _type === this.itemType(12, 50) ||
          _type === this.itemType(12, 268) ||
          _type === this.itemType(12, 270)
        ) {
          Defense += this.level * 4;

          if (this.level >= 10) {
            Defense += this.level - 9;
          }
        } else if (
          (_type >= this.itemType(12, 3) && _type <= this.itemType(12, 6)) ||
          _type === this.itemType(13, 30) ||
          _type === this.itemType(13, 4) ||
          _type === this.itemType(12, 269)
        ) {
          Defense += this.level * 2;
        } else {
          Defense += this.level * 3;
        }

        if (this.level >= 10) {
          Defense += ((this.level - 9) * (this.level - 8)) / 2;
        }
      }

      if (this.is_pentagram) {
        display += `<div class="items-stats item-armor">Elemental defense: ${Math.floor(
          Defense,
        )}</div>`;
      } else {
        display += `<div class="items-stats item-armor">Armor: ${Math.floor(
          Defense,
        )}</div>`;
      }
    }

    // item durability
    if (this.is_pentagram) {
      display += `<div class="items-stats trade-limit">Trade Limit: ${
        this.durability
      }</div>`;
    } else if (!this.is_errtel) {
      display += `<div class="items-stats item-durability">Durability: ${
        this.durability
      }</div>`;
    }

    // required level
    if (this.data["ReqLevel"] && this.data["ReqLevel"] > 0) {
      display += `<div class="items-stats required-level">Minimum Level Required: ${
        this.data["ReqLevel"]
      }</div>`;
    }

    // required strength
    if (this.data["ReqStrength"] > 0) {
      let ReqStrength = Math.floor(
        (this.data["ReqStrength"] * (ItemLevel + this.level * 3) * 3) / 100 +
          20,
      );

      if (this.option > 0) {
        ReqStrength += this.option * 4;
      }

      display += `<div class="items-stats required-strength">Strength available: ${ReqStrength}</div>`;
    }

    // required agility
    if (this.data["ReqDexterity"] > 0) {
      let ReqDexterity = Math.floor(
        (this.data["ReqDexterity"] * (ItemLevel + this.level * 3) * 3) / 100 +
          20,
      );

      if (this.option > 0) {
        ReqDexterity += this.option * 4;
      }

      display += `<div class="items-stats required-agility required-dexterity">Agility available: ${ReqDexterity}</div>`;
    }

    // required vitality
    if (this.data["ReqVitality"] > 0) {
      let ReqVitality = Math.floor(
        (this.data["ReqVitality"] * (ItemLevel + this.level * 3) * 3) / 100 +
          20,
      );

      if (this.option > 0) {
        ReqVitality += this.option * 4;
      }

      display += `<div class="items-stats required-vitality required-stamina">Vitality available: ${ReqVitality}</div>`;
    }

    // required energy
    if (this.data["ReqEnergy"] > 0) {
      let ReqEnergy = Math.floor(
        (this.data["ReqEnergy"] * (ItemLevel + this.level * 3) * 4) / 100 + 20,
      );

      if (this.option > 0) {
        ReqEnergy += this.option * 4;
      }

      display += `<div class="items-stats required-energy">Energy available: ${ReqEnergy}</div>`;
    }

    // required command
    if (this.data["ReqCommand"] > 0) {
      let ReqCommand = Math.floor(
        (this.data["ReqCommand"] * (ItemLevel + this.level * 3) * 3) / 100 + 20,
      );

      if (this.option > 0) {
        ReqCommand += this.option * 4;
      }

      display += `<div class="items-stats required-command required-leadership">Command available: ${ReqCommand}</div>`;
    }

    // item wizardry damage
    if (this.data["MagicPower"] > 0) {
      let MagicPower = this.data["MagicPower"];

      if (this.ancient !== 0 && ItemLevel !== 0) {
        MagicPower += (MagicPower * 25) / this.data["DropLevel"] + 5;
        MagicPower += ItemLevel / 60 + 2;
      } else {
        if (this.excellent > 0) {
          if (iChaosItem !== 0) {
            MagicPower += iChaosItem;
          } else if (this.data["DropLevel"] !== 0) {
            MagicPower += (MagicPower * 25) / this.data["DropLevel"] + 5;
          }
        }
      }

      MagicPower += this.level * 3;

      if (this.level >= 10) {
        MagicPower += ((this.level - 9) * (this.level - 8)) / 2;
      }

      display += `<div class="items-stats wizardry-increase">Increases wizardry by ${Math.floor(
        MagicPower,
      )}%</div>`;
    }

    // classes allowed to equip the item
    if (!this.is_errtel) {
      if (CharacterClass.isItemAvailableForAllClasses(this) === false) {
        display += `<div class="equip-class">`;
        CharacterClass.getItemEquipClass(this).forEach(className => {
          display += `<div class="equip-class-name">Can be equipped by ${className}</div>`;
        });
        display += `</div>`;
      }
    }

    // item refinery options
    if (this.refinery) {
      display += `<div class="refinery-options">`;
      Refinery.getOptions(this).forEach(function(option, id) {
        display += `<div class="refinery-option refinery-option-${id}">${option}</div>`;
      });
      display += `</div>`;
    }

    // item harmony options
    if (
      !this.is_pentagram &&
      !this.is_errtel &&
      Socket.isSocketItem(this) === false &&
      this.harmony_type !== 0
    ) {
      display += `<div class="harmony-options">`;
      Harmony.getOptions(this).forEach(function(option, id) {
        display += `<div class="harmony-option harmony-option-${id}">${
          option.name
        }</div>`;
      });
      display += `</div>`;
    }

    // ancient additional stats
    if (this.ancient > 0) {
      Ancient.getStats(this).forEach(function(stats) {
        display += `<div class="ancient-additional-stats">${stats}</div>`;
      });
    }

    // item skill
    if (this.skill && this.data["SkillIndex"] && this.data["SkillIndex"] > 0) {
      display += `<div class="item-skill-option">${Skill.getName(this)}</div>`;
    }

    // item luck
    if (this.luck !== 0) {
      display += `<div class="item-luck-option">Luck (success rate of Jewel of Soul +25%)</div>`;
      display += `<div class="item-luck-option">Luck (critical damage rate +5%)</div>`;
    }

    // item additional options
    if (this.option !== 0) {
      let [value, text] = this.getAdditionalOption();
      text = text.replace("%s", `+${value}`);
      display += `<div class="item-additional-option">${text}</div>`;
    }

    // item excellent options
    if (this.excellent !== 0) {
      display += `<div class="item-excellent-options">`;
      Excellent.getOptions(this).forEach(function(option, key) {
        display += `<div class="item-excellent-option item-excellent-option-${key}">${option}</div>`;
      });
      display += `</div>`;
    }

    if (this.is_pentagram) {
      let slots = ["Anger", "Blessing", "Integrity", "Divinity", "Gale"];

      display += `<div class="pentagram-errtel-slots">`;

      this.sockets.forEach((socket, index) => {
        if (socket !== 255) {
          display += `<div class="pentagram-errtel-slot">`;

          if (socket === 254) {
            display += `
              <div class="errtel-slot-type">Slot of ${slots[index]} (${index +
              1})</div>
              <div class="errtel-slot-name">None</div>
            `;
          } else {
            display += `
              <div class="errtel-slot-type">Slot of ${slots[index]} (${index +
              1})</div>
              <div class="errtel-slot-name">Errtel of ${slots[index]}</div>
            `;
          }

          display += `</div>`;
        }
      });

      display += `</div>`;
    } else if (this.is_errtel) {
      let rank = this._bytes[10] % 16;

      display += `<div class="item-errtel">`;
      display += `<div class="errtel-rank">${rank} Rank Errtel</div>`;

      this.sockets.forEach((socket, index) => {
        if (socket !== 255) {
          let options = elemental[12][this.id][index + 1];
          let option = options[(socket % 16) - 1];
          let level = Math.floor(socket / 16);
          let number = index + 1;

          let name = option["Name"]
            .replace("%d%", option["OptionValue" + level])
            .replace("%d", option["OptionValue" + level]);

          display += `
            <div class="item-errtel-option">
              <div class="option-rank">${number} Rank Option +${level}</div>
              <div class="option-name">${name}</div>
            </div>
          `;
        }
      });

      display += `</div>`;
    } else {
      if (Socket.isSocketItem(this) && Socket.itemHasSockets(this)) {
        let socketOptions = Socket.getOptions(this);
        let bonusSocketOptions = Socket.getBonusSocketOption(this);

        if (socketOptions.length > 0) {
          display += `<div class="item-socket-options">`;
          display += `<div class="item-socket-options-info">Socket item option info</div>`;
          socketOptions.forEach(function(option, id) {
            if (option.code === 254) {
              display += `<div class="item-socket-empty item-socket-option-${id}">${
                option.name
              }</div>`;
            } else {
              display += `<div class="item-socket-option item-socket-option-${id}">${
                option.name
              }</div>`;
            }
          });

          if (bonusSocketOptions.length > 0) {
            display += `<div class="item-socket-options-info">Bonus socket option</div>`;
            bonusSocketOptions.forEach(option => {
              display += `<div class="item-socket-bonus-option">${
                option.name
              } +${option.value}</div>`;
            });
          }

          display += `</div>`;
        }
      }
    }

    if (this.ancient !== 0) {
      display += `<div class="item_ancient_info">Set Item option info</div>`;

      try {
        Ancient.getSetOptions(this).forEach(function(option) {
          display += `<div class="item_ancient">${option}</div>`;
        });
      } catch (err) {
        display += `<div class="item_ancient">${err}</div>`;
      }
    }

    display += "</div>";

    return display;
  }
}
