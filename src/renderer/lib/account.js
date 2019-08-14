import { query } from "./sql";
import { Type } from "./type";

export async function getAccounts() {
  return query(`
    SELECT 
      memb___id as account,
      memb__pwd as password,
      memb_name as name,
      mail_addr as email,
      bloc_code as block,
      ctl1_code as control 
    FROM 
      MEMB_INFO
  `);
}

export async function getCharacters(account) {
  return query(
    `
    SELECT 
      Name as name,
      cLevel as level,
      mLevel as master,
      mlPoint as masterPoints,
      LevelUpPoint as points,
      Class as class,
      Money as money,
      Strength as str,
      Dexterity as agi,
      Vitality as vit,
      Energy as ene,
      Leadership as com,
      MapNumber as map,
      PkCount as pk,
      CtlCode as control,
      RESETS as resets,
      GrandResets as grands, 
      Inventory as inventory, 
      InventoryExpansion as expansion
    FROM 
      Character
    WHERE
      AccountID=@account  
  `,
    [Type.account(account)],
  );
}
