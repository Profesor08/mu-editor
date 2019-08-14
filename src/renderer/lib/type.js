import mssql from "mssql";

export const Type = {
  account(value) {
    return {
      name: "account",
      type: mssql.VarChar,
      value: value,
    };
  },

  money(value) {
    return {
      name: "money",
      type: mssql.Int,
      value: value,
    };
  },

  items(value) {
    return {
      name: "items",
      type: this.itemsType,
      value: value,
    };
  },

  state(value) {
    return {
      name: "state",
      type: mssql.TinyInt,
      value: value,
    };
  },

  itemsType: mssql.VarBinary(0),
};
