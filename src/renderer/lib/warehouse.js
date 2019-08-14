import mssql from "mssql";
import { query, execute } from "./sql";
import { Type } from "./type";

const ACCOUNT_ALREADY_HAS_WAREHOUSE = "Account already has warehouse!";
const ACCOUNT_WAREHOUSE_NOT_EXISTS = "Account warehouse not exists";
const ACCOUNT_WAREHOUSE_MUST_BE_CLOSED = "Account warehouse must be closed!";
const ACCOUNT_WAREHOUSE_MUST_BE_OPENED = "Account warehouse must be opened!";

export async function getRawWarehouse(account) {
  const response = await query(
    `SELECT Items as items, Expanded as expanded, Money as money, WHOpen as opened FROM warehouse WHERE AccountID = @account`,
    [Type.account(account)],
  );

  Type.itemsType = response.recordset.columns.items.type(
    response.recordset.columns.items.length,
  );

  return response;
}

export async function getWarehouse(account) {
  const response = await getRawWarehouse(account);

  warehouseMustExist(response);

  return response;
}

function warehouseMustBeOpen(response) {
  if (response.recordset.length > 0) {
    if (response.recordset[0].opened !== 1) {
      throw new Error(ACCOUNT_WAREHOUSE_MUST_BE_OPENED);
    }
  }
}

function warehouseMustBeClosed(response) {
  if (response.recordset.length > 0) {
    if (response.recordset[0].opened !== 0) {
      throw new Error(ACCOUNT_WAREHOUSE_MUST_BE_CLOSED);
    }
  }
}

function warehouseMustExist(response) {
  if (response.recordset.length === 0) {
    throw new Error(ACCOUNT_WAREHOUSE_NOT_EXISTS);
  }
}

function warehouseMustNotExist(response) {
  if (response.recordset.length !== 0) {
    throw new Error(ACCOUNT_ALREADY_HAS_WAREHOUSE);
  }
}

export async function createWarehouse(account) {
  const response = await getRawWarehouse(account);

  warehouseMustNotExist(response);

  return await query(
    `INSERT INTO warehouse (AccountID, Items, Money, Expanded, WHOpen) VALUES (@account, @items, 0, 0, 0)`,
    [
      Type.account(account),
      Type.items(Buffer.alloc(response.recordset.columns.items.length, 255)),
    ],
  );
}

export async function clearWarehouse(account) {
  const response = await getRawWarehouse(account);

  warehouseMustExist(response);
  warehouseMustBeClosed(response);

  return await query(
    `UPDATE warehouse SET Items=@items WHERE AccountID = @account`,
    [
      Type.account(account),
      Type.items(Buffer.alloc(response.recordset.columns.items.length, 255)),
    ],
  );
}

export async function repairWarehouse(account) {
  const response = await getRawWarehouse(account);

  warehouseMustExist(response);
  warehouseMustBeClosed(response);

  const items = Buffer.concat(
    [response.recordset[0].items, Buffer.alloc(Type.itemsType.length, 0)],
    Type.itemsType.length,
  );

  return await query(
    `UPDATE warehouse SET Items=@items WHERE AccountID = @account`,
    [Type.account(account), Type.items(items)],
  );
}

export async function setWarehouseMoney(account, amount) {
  const response = await getRawWarehouse(account);

  warehouseMustExist(response);
  warehouseMustBeClosed(response);

  return await query(
    `UPDATE warehouse SET Money=@money WHERE AccountID = @account`,
    [Type.account(account), Type.money(amount)],
  );
}

export async function setExpandedWarehouseState(account, state = 0) {
  const response = await getRawWarehouse(account);

  warehouseMustExist(response);
  warehouseMustBeClosed(response);

  return query(
    `UPDATE warehouse SET Expanded=@state WHERE AccountID = @account`,
    [Type.account(account), Type.state(state)],
  );
}

function cloneItems(items, byte = 255) {
  try {
    return Buffer.from(items);
  } catch (err) {
    return Buffer.alloc(Type.itemsType.length, byte);
  }
}

function fillWarehouse(warehouseItems, from, to, byte = 255) {
  const items = cloneItems(warehouseItems);

  for (let i = from; i < to; i++) {
    items[i] = byte;
  }

  return items;
}

export async function deleteWarehouseItem(account, offset) {
  const response = await getRawWarehouse(account);

  warehouseMustExist(response);
  warehouseMustBeClosed(response);

  const end = offset + Type.itemsType.length / 120 / 2;

  const items = fillWarehouse(response.recordset[0].items, offset, end);

  return query(`UPDATE warehouse SET Items=@items WHERE AccountID = @account`, [
    Type.account(account),
    Type.items(items),
  ]);
}

export async function setWarehouseItems(account, items) {
  const response = await getRawWarehouse(account);

  warehouseMustExist(response);
  warehouseMustBeClosed(response);

  return query(`UPDATE warehouse SET Items=@items WHERE AccountID = @account`, [
    Type.account(account),
    Type.items(Buffer.from(items)),
  ]);
}

export async function setWarehouseItem(account, offset, item) {
  const response = await getRawWarehouse(account);

  warehouseMustExist(response);
  warehouseMustBeClosed(response);

  const items = Array.from(response.recordset[0].items);

  items.splice(offset, item.length, ...item);

  return await setWarehouseItems(account, items);
}

export async function getItemSerial() {
  return await query(`
    exec WZ_GetItemSerial
    exec WZ_GetItemSerial2 1
  `);
}
