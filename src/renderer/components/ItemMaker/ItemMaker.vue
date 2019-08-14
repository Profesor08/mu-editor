<template>
  <div class="item-maker" v-bind:class="{'elevation-10': floating}">
    <v-layout>
      <v-subheader>Item Maker</v-subheader>
    </v-layout>
    <v-layout>
      <v-flex xs4>
        <item-group
          :groups="itemGroups"
          v-model="item.group"
          @change="e => {this.itemChanged(e); this.updateExcellentOptions()}"
        ></item-group>
      </v-flex>
      <v-flex xs4>
        <items-list
          :items="items"
          v-model="item.id"
          @change="e => {this.itemChanged(e); this.updateExcellentOptions()}"
        ></items-list>
      </v-flex>
      <v-flex xs2>
        <item-level v-model="item.level" @change="itemChanged"></item-level>
      </v-flex>
      <v-flex xs2>
        <item-option v-model="item.option" @change="itemChanged"></item-option>
      </v-flex>
    </v-layout>
    <v-spacer></v-spacer>
    <v-layout>
      <v-flex xs4 class="options-container">
        <div class="group-label">Options</div>
        <v-checkbox v-model="item.luck" label="Luck" @change="itemChanged"></v-checkbox>
        <v-checkbox v-model="item.skill" label="Skill" @change="itemChanged"></v-checkbox>
        <v-checkbox v-model="item.refinery" label="Refinery" @change="itemChanged"></v-checkbox>
        <v-text-field
          v-model.number="item.durability"
          label="Durability"
          type="number"
          min="0"
          max="255"
          @input="itemChanged"
        ></v-text-field>
      </v-flex>
      <v-flex xs4 class="options-container">
        <div class="group-label">Ancient</div>
        <v-radio-group v-model="item.ancient.set" @change="itemChanged">
          <v-radio label="None" :value="0"></v-radio>
          <v-radio :label="ancientSet1" :value="5"></v-radio>
          <v-radio :label="ancientSet2" :value="6"></v-radio>
        </v-radio-group>
        <v-select
          :items="ancientStats"
          v-model="item.ancient.level"
          :item-text="ancientStatPointsOptionText"
          item-value="value"
          label="Stat points"
          dense
          @change="itemChanged"
        ></v-select>
      </v-flex>
      <v-flex xs4 class="options-container">
        <div class="group-label">Serial</div>
        <v-radio-group v-model="item.serial.type" @change="itemChanged">
          <v-radio label="00000000" :value="0"></v-radio>
          <v-radio label="game valid" :value="1"></v-radio>
          <v-radio label="custom" :value="2"></v-radio>
        </v-radio-group>
        <v-text-field
          v-model.number="item.serial.value1"
          label="Serial"
          type="number"
          min="0"
          max="4294967295"
          :disabled="item.serial.type !== 2"
          @input="itemChanged"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs8>
        <item-excellent v-model="item.excellent" :item="item" @change="itemChanged"></item-excellent>
      </v-flex>
      <v-flex xs4>
        <item-image :item="currentItem"></item-image>
      </v-flex>
    </v-layout>
    <v-layout v-if="!currentItem.isPentagramItem() && !currentItem.isErrtelItem()">
      <v-flex>
        <item-harmony v-model="item.harmony" :item="item" @change="itemChanged"></item-harmony>
      </v-flex>
    </v-layout>
    <v-layout v-if="currentItem.isPentagramItem() || currentItem.isErrtelItem()">
      <v-flex>
        <item-element v-model="item.harmony" :item="item" @change="itemChanged"></item-element>
      </v-flex>
    </v-layout>
    <v-layout v-if="!currentItem.isPentagramItem() && !currentItem.isErrtelItem()">
      <v-flex>
        <item-sockets v-model="item.sockets" :item="item" @change="itemChanged"></item-sockets>
      </v-flex>
    </v-layout>
    <v-layout v-if="currentItem.isPentagramItem()">
      <v-flex>
        <item-pentagram-options v-model="item.sockets" :item="item" @change="itemChanged"></item-pentagram-options>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { Item, ItemsData, Excellent } from "../../lib/item";
import ItemGroup from "./ItemGroup";
import ItemsList from "./ItemsList";
import ItemLevel from "./ItemLevel";
import ItemOption from "./ItemOption";
import ItemImage from "./ItemImage";
import ItemExcellent from "./ItemExcellent";
import ItemSockets from "./ItemSockets";
import ItemHarmony from "./ItemHarmony";
import ItemPentagramOptions from "./ItemPentagramOptions";
import ItemElement from "./ItemElement";

export default {
  name: "item-maker",

  components: {
    ItemGroup,
    ItemsList,
    ItemLevel,
    ItemOption,
    ItemImage,
    ItemExcellent,
    ItemSockets,
    ItemHarmony,
    ItemPentagramOptions,
    ItemElement,
  },

  data() {
    return {
      floating: false,
      itemGroups: [
        "Swords",
        "Axes",
        "Mace/Scepter",
        "Spears",
        "Bows/Crossbows",
        "Staves",
        "Shields",
        "Helms",
        "Armors",
        "Pants",
        "Gloves",
        "Boots",
        "Wings/Other",
        "Miscs 1",
        "Miscs 2",
        "Scrolls",
      ],
      item: {
        group: 12,
        id: 208,
        level: 0,
        option: 0,
        luck: false,
        skill: false,
        refinery: false,
        durability: 0,
        ancient: {
          set: 0,
          level: 0,
        },
        serial: {
          type: 0,
          value1: 0,
          value2: 0,
        },
        excellent: [],
        sockets: [255, 255, 255, 255, 255],
        harmony: {
          option: 0,
          level: 0,
        },
      },

      durabilityValues: new Array(256).fill(0).map((_, id) => id),

      ancientStats: [{ name: "+5", value: 0 }, { name: "+10", value: 4 }],

      excellentOptions: [],
    };
  },

  computed: {
    items() {
      try {
        const group = ItemsData.getGroup(this.item.group);

        if (group[this.item.id] === undefined) {
          this.item.id = 0;
        }

        return Object.assign({}, group);
      } catch (err) {
        console.warn(err);
      }

      return Object.assign({}, []);
    },

    ancientSet1() {
      return "Set 1";
    },

    ancientSet2() {
      return "Set 2";
    },

    currentItem() {
      return new Item(Item.createItemBytes(this.item));
    },
  },

  methods: {
    itemChanged() {
      this.$emit("input", this.item);
    },

    ancientStatPointsOptionText(option) {
      return `${option.name} points`;
    },

    isSocketOptionsActive() {
      return (
        false ===
        (this.currentItem.isPentagramItem() || this.currentItem.isErrtelItem())
      );
    },

    isHarmonyOptionsActive() {},

    updateExcellentOptions() {
      const options = new Array(6).fill(0).map((_, id) => {
        return {
          Number: id,
          Text: "unknown",
        };
      });

      try {
        const item = this.currentItem;

        if (!item.isEmpty()) {
          Excellent.getAvailableOptions(item).forEach((option, index) => {
            if (option.Number <= 5) {
              options[index] = {
                ...option,
                Text: Excellent.getOptionText(item, option),
              };
            }
          });
        }
      } catch (err) {
        console.warn(err);
      }

      this.excellentOptions = options;
    },
  },

  beforeMount() {
    this.updateExcellentOptions();
    this.itemChanged();
  },
};
</script>

<style lang="scss">
.item-maker {
  padding: 0 16px;

  .spacer {
    height: 10px;
  }

  .v-subheader {
    padding: 0;
  }

  .v-label {
    font-size: 11px;
    max-width: calc(100% - 20px);
    min-width: 0;

    .label-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .group-label {
    font-size: 11px;
    margin-bottom: 4px;
  }

  .image-container {
    width: 100%;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;

    .item-image {
      object-fit: contain;
      object-position: center center;
      max-width: 100%;
      max-height: 100%;
    }
  }

  .material-icons {
    font-size: 11px;
  }

  .options-container {
    padding-right: 16px;
  }

  .scrollable-list.v-input--selection-controls {
    .v-input--radio-group__input {
      height: 258px;
      overflow-x: hidden;
      overflow-y: scroll;
    }
  }

  .v-input--selection-controls {
    margin: 0 16px 0 0;
    padding: 0;

    &.v-input--checkbox {
      height: 16px;
    }

    .v-messages {
      display: none;
    }

    .v-input__control {
      flex-grow: 1;
      width: 100%;
    }

    .v-input__slot {
      margin: 0 !important;
    }

    .v-input--selection-controls__input {
      width: auto;
      height: auto;
      margin-right: 4px;
    }

    .v-radio {
      margin: 0 !important;
      height: 16px;
      flex: 0 0 auto;

      &.accent--text {
        .v-label {
          color: #82b1ff !important;
        }
      }

      &:hover {
        .v-label {
          color: #82b1ff !important;
        }
      }

      .v-label {
        flex: 1 0 auto;
      }
    }

    .v-input--selection-controls__ripple {
      display: none;
    }
  }

  // .v-input--radio-group__input {
  // }
}
</style>
