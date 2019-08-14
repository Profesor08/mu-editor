import skillList from "./items-data/skillList";

export class Skill {
  static getName(item) {
    try {
      let skill = skillList[item.data["SkillIndex"]];
      return `${skill["Name"]} (Mana: ${skill["ManaUsage"]})`;
    } catch (err) {
      return "Unknown skill name";
    }
  }
}
