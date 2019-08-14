<template>
  <div class="items-grid" :data-rows="y">
    <item-cell
      v-for="(cell, index) in cells"
      :key="`cell-` + index"
      :offset="cell.offset"
      :x="cell.x"
      :y="cell.y"
      @click="addItem"
    ></item-cell>
    <mu-item
      v-for="item in gameItems"
      :key="`item-` + item.offset"
      :item="item"
      :account="account"
      :storage="`warehouse`"
      :onItemDeleted="onItemDeleted"
      :onItemAdded="onItemAdded"
    ></mu-item>
  </div>
</template>

<script>
import MuItem from "./MuItem";
import ItemCell from "./ItemCell";
import { Item } from "../../lib/item/Item";
import { setWarehouseItem, getItemSerial } from "../../lib/warehouse";
import { Matrix } from "../../lib/math";

export default {
  name: "items-grid",

  components: { MuItem, ItemCell },

  props: {
    x: Number,
    y: Number,
    start: Number,
    end: Number,
    bytes: Number,
    items: Array,
    item: Object,
    isAvailable: Boolean,
    account: String,
    onItemDeleted: Function,
    onItemAdded: Function,
  },

  data() {
    return {
      cell: {
        x: 0,
        y: 0,
      },
    };
  },

  computed: {
    cells() {
      const cells = new Array(this.x * this.y).fill(0).map((_, id) => {
        return {
          x: Math.floor(id % 8),
          y: Math.floor(id / 8),
          offset: this.start + id * this.bytes,
        };
      });

      return cells;
    },

    gameItems() {
      const items = [];

      for (let i = this.start, id = 0; i < this.end; i += this.bytes, id++) {
        const itemBytes = this.items.slice(i, i + this.bytes);

        if (itemBytes.length === 0) {
          break;
        }

        try {
          let item = new Item(itemBytes);

          if (item.isEmpty()) {
            continue;
          }

          items.push({
            offset: i,
            x: Math.floor(id % 8),
            y: Math.floor(id / 8),
            width: item.data["Width"],
            height: item.data["Height"],
            item: item,
          });
        } catch (err) {
          console.warn(err);
        }
      }

      return items;
    },

    warehouseSlots() {
      const slots = [];

      for (let i = 0; i < 8; i++) {
        slots.push(new Array(15));
        for (let j = 0; j < 15; j++) {
          slots[i][j] = 0;
        }
      }

      function fill(x, y, width, height) {
        for (let i = x; i < x + width; i++) {
          for (let j = y; j < y + height; j++) {
            slots[i][j] = 1;
          }
        }
      }

      for (let i = this.start, id = 0; i < this.end; i += this.bytes, id++) {
        const itemBytes = this.items.slice(i, i + this.bytes);

        if (itemBytes.length === 0) {
          break;
        }

        try {
          let item = new Item(itemBytes);

          if (item.isEmpty()) {
            continue;
          }

          const x = Math.floor(id % 8);
          const y = Math.floor(id / 8);
          const width = item.data["Width"];
          const height = item.data["Height"];

          fill(x, y, width, height);
        } catch (err) {
          console.warn(err);
        }
      }

      return slots;
    },
  },

  methods: {
    async addItem({ x, y, offset, stopLoading }) {
      try {
        const itemData = {
          ...this.item,
          ancient: { ...this.item.ancient },
          serial: { ...this.item.serial },
          excellent: [...this.item.excellent],
        };

        switch (itemData.serial.type) {
          case 1: {
            try {
              const response = await getItemSerial();

              itemData.serial.value1 = parseInt(response.recordsets[0][0][""]);
              itemData.serial.value2 = parseInt(
                response.recordsets[1][0]["ItemSerial"],
              );

              break;
            } catch (err) {
              console.warn(err);
              this.$msg.warn("Can't get item serial. Serial is set to 0.");
              itemData.serial.value1 = 0;
              itemData.serial.value2 = 0;
            }
          }

          case 2: {
            itemData.serial.value2 = itemData.serial.value1;
            break;
          }

          default: {
            itemData.serial.value1 = 0;
            itemData.serial.value2 = 0;
          }
        }

        const bytes = Item.createItemBytes(itemData);
        const item = new Item(bytes);
        const width = item.data["Width"];
        const height = item.data["Height"];

        // return;

        try {
          if (x + width - 1 > 7 || y + height - 1 > 14) {
            throw new Error("No free space");
          }

          for (let i = x; i < x + width; i++) {
            for (let j = y; j < y + height; j++) {
              if (this.warehouseSlots[i][j] === 1) {
                throw new Error("No free space");
              }
            }
          }

          await setWarehouseItem(this.account, offset, item.bytes);
        } catch (err) {
          this.$msg.error(err.message);
        }
      } catch (err) {
        console.warn(err);
      }

      stopLoading();

      if (this.onItemAdded) {
        await this.onItemAdded();
      }
    },
  },

  mounted() {},
};
</script>

<style lang="scss">
.items-grid {
  $cols: 8;
  $rows: 15;
  $size: 30px;
  $gap: 1px;
  $background: rgba(35, 37, 37, 1);
  $border: #555555;

  position: relative;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: $gap $gap;

  background: $border;
  border: $gap solid $border;

  &[data-rows="1"] {
    grid-template-rows: 1fr;
  }

  &[data-rows="2"] {
    grid-template-rows: 1fr 1fr;
  }

  &[data-rows="3"] {
    grid-template-rows: 1fr 1fr 1fr;
  }

  &[data-rows="4"] {
    grid-template-rows: 1fr 1fr 1fr 1fr;
  }

  &[data-rows="5"] {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  }

  &[data-rows="6"] {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  &[data-rows="7"] {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  &[data-rows="8"] {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  &[data-rows="9"] {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  &[data-rows="10"] {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  &[data-rows="11"] {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  &[data-rows="12"] {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  &[data-rows="13"] {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  &[data-rows="14"] {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  &[data-rows="15"] {
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  .cell {
    width: $size;
    height: $size;
    background: $background;
    font-size: 9px;

    &:hover {
      background: lighten($background, 5%);
    }
  }

  .mu-item {
    border: $gap solid $background;
    background: $background;
    position: absolute;

    &:hover {
      background: lighten($background, 5%);
    }

    @for $i from 0 to $cols {
      &[data-width="#{$i}"] {
        width: $size * $i + $i * $gap - $gap;
      }

      &[data-x="#{$i}"] {
        left: $size * $i + $i * $gap;
      }
    }

    @for $i from 0 to $rows {
      &[data-height="#{$i}"] {
        height: $size * $i + $i * $gap - $gap;
      }

      &[data-y="#{$i}"] {
        top: $size * $i + $i * $gap;
      }
    }
  }
}
</style>
