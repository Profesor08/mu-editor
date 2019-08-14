const Item = require("./Item");

export class ItemGrid {
  constructor() {}

  /**
   * Creating items equipment grid
   * @param items - array of bytes
   */
  static getCharacterEquipmentGrid(items) {
    let bytes = items.length / 237;
    let equippedItems = 12;
    let start = bytes * equippedItems + bytes * 64 + bytes * 32 * 5;
    let itemsArray = [];

    for (let i = 0; i < bytes * 12; i += bytes) {
      itemsArray.push(new Item(items.slice(i, i + bytes)));
    }

    if (items.length) {
      itemsArray.push(new Item(items.slice(start, start + bytes)));
    }

    let grid = document.createElement("div");

    grid.classList.add("character-equipment");

    for (let i = 0; i < 8 * 9; i++) {
      let div = document.createElement("div");
      div.classList.add("cell");
      grid.appendChild(div);
    }

    itemsArray.forEach(function(item, id) {
      let div = document.createElement("div");

      div.classList.add("item");
      div.setAttribute("data-equipment", `${id}`);

      if (!item.isEmpty()) {
        div.setAttribute("data-type", "item");
        div.setAttribute("data-popup", "");
        div.setAttribute("data-popup-content", "item");

        contextMenu.attach(div);

        div.item = item;

        let img = new Image();

        img.src = item.getImage();

        div.appendChild(img);
      }

      grid.appendChild(div);
    });

    return grid;
  }

  /**
   * Creating items grid for character main inventory
   * @param items - array of bytes
   * @return {HTMLDivElement}
   */
  static getCharacterInventoryGrid(items) {
    let bytes = items.length / 237;
    let equippedItems = 12;

    return this.getWarehouseGrid(
      items,
      bytes * equippedItems,
      bytes * equippedItems + bytes * 64,
      bytes,
      8,
    );
  }

  /**
   * Creating items grid for personal store
   * @param items - array of bytes
   * @return {HTMLDivElement}
   */
  static getCharacterPersonalStoreGrid(items) {
    return this.getCharacterExtendedInventoryGrid(4, items);
  }

  /**
   * Creating items grid for character extended inventory
   * @param id - inventory ID values 0, 1, 2, 3, 4 is personal store clone
   * @param items - array of bytes
   * @return {HTMLDivElement}
   */
  static getCharacterExtendedInventoryGrid(id, items) {
    let bytes = Math.floor(items.length / 237);
    let equippedItems = 12;
    let start = bytes * equippedItems + bytes * 64 + bytes * 32 * id;
    let end = start + bytes * 32;

    return this.getWarehouseGrid(items, start, end, bytes, 4);
  }

  /**
   * Creating items grid for main warehouse
   * @param items - array of bytes
   * @return {HTMLDivElement}
   */
  static getMainWarehouseGrid(items) {
    return this.getWarehouseGrid(
      items,
      0,
      items.length / 2,
      items.length / 2 / 120,
      15,
    );
  }

  /**
   * Creating items grid for extended warehouse
   * @param items - array of bytes
   * @return {HTMLDivElement}
   */
  static getExtendedWarehouseGrid(items) {
    return this.getWarehouseGrid(
      items,
      items.length / 2,
      items.length,
      items.length / 2 / 120,
      15,
    );
  }

  /**
   * Creating items grid
   * @param items - array of bytes
   * @param start - starting offset
   * @param end - end offset
   * @param bytes - item length in bytes
   * @param rows - how much rows must be (just for style)
   * @return {HTMLDivElement}
   */
  static getWarehouseGrid(items, start, end, bytes, rows) {
    let grid = document.createElement("div");

    grid.classList.add("warehouse");
    grid.setAttribute("data-rows", rows);

    for (let i = start; i < end; i += bytes) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-offset", i);
      cell.addEventListener("click", () => {
        console.log("adding-item", cell.getAttribute("data-offset"));
      });
      grid.appendChild(cell);
    }

    for (let i = start, id = 0; i < end; i += bytes, id++) {
      try {
        let item = new Item(items.slice(i, i + bytes));

        if (item.isEmpty()) {
          continue;
        }

        let div = document.createElement("div");

        div.classList.add("item");

        div.setAttribute("data-type", "item");
        div.setAttribute("data-offset", i);
        div.setAttribute("data-x", Math.floor(id % 8).toString());
        div.setAttribute("data-y", Math.floor(id / 8).toString());
        div.setAttribute("data-width", item.data["Width"]);
        div.setAttribute("data-height", item.data["Height"]);
        div.setAttribute("data-popup", "");
        div.setAttribute("data-popup-content", "item");

        div.item = item;

        let img = new Image();

        img.src = item.getImage();

        div.appendChild(img);

        grid.appendChild(div);
      } catch (err) {
        console.error(err);
      }
    }

    return grid;
  }

  /**
   * Creating empty items grid
   * @return {HTMLDivElement}
   */
  static getEmptyWarehouseGrid(x, y) {
    let grid = document.createElement("div");

    grid.classList.add("warehouse");
    grid.setAttribute("data-rows", `${y}`);

    for (let i = 0; i < x * y; i++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      grid.appendChild(cell);
    }

    return grid;
  }
}
