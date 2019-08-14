<template>
  <div class="sockets-options">
    <div class="group-label">Sockets</div>
    <v-layout v-for="(option, id) in selected" :key="`socket-${id}`" class="socket-option-row">
      <v-select
        class="dense-select"
        label="Option"
        v-model="selected[id].option"
        :items="sockets"
        :item-text="socketOptionName"
        return-object
        dense
        single-line
        @input="option => socketOptionChange(id, option)"
      ></v-select>
      <v-select
        class="dense-select socket-level"
        v-model="selected[id].seletedValue"
        :items="selected[id].values"
        :item-text="b => socketBonusValue(selected[id].option, b)"
        item-value="id"
        label="Value"
        dense
        single-line
        @input="socketOptionValueChange"
      ></v-select>
    </v-layout>
  </div>
</template>

<script>
import { Socket, formula, element } from "../../lib/item/Socket";

function getBonusValues(option) {
  let values = [];

  for (let i = 1; i <= 5; i++) {
    values.push(option[`BonusValue${i}`]);
  }

  return values;
}

export default {
  name: "item-sockets",

  props: {
    value: Array,
    item: Object,
  },

  data() {
    return {
      selected: [],
    };
  },

  computed: {
    sockets() {
      const options = Socket.getAvailableSocketOptions().map(option => {
        return {
          index: option.Index,
          name: option.Name,
          level: option.Level,
          element: option.ElementType,
          bonusType: option.BonusType,
          bonusValues: getBonusValues(option),
        };
      });

      options.unshift({
        index: 254,
        name: "Empty socket",
        level: 0,
        element: 0,
        bonusType: 0,
        bonusValues: [0],
      });

      options.unshift({
        index: 255,
        name: "No socket",
        level: 0,
        element: 0,
        bonusType: 0,
        bonusValues: [0],
      });

      return options;
    },
  },

  methods: {
    changeHandler(e) {
      this.$emit("input", e);
      this.$emit("change", e);
    },

    socketOptionName(option) {
      return `${element(option.element)} (${option.name})`;
    },

    // 0   1    2    3  4  5  6  7   8  9  10   11 12  13  14  15 16 17  18
    // 26, 255, 137, 0, 0, 0, 0, 64, 0, 0, 255, 0, 16, 17, 18, 2, 0, 28, 9, 105, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255
    // 26, 255, 137, 0, 0, 0, 0, 64, 0, 0, 0,   0, 16, 17, 18, 2, 0, 0,  0, 0,   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255

    socketBonusValue(option, value) {
      if (option.index === 255) {
        return "None";
      }

      if (option.index === 254) {
        return "Empty";
      }

      if (option.bonusType <= 1) {
        return "+" + formula(option.bonusType)(value.bonus, option.level);
      }

      return formula(option.bonusType)(value.bonus, option.level);
    },

    setSocketBonusValues(id, option) {
      this.selected[id].values = option.bonusValues.map((bonus, id) => {
        return {
          id,
          bonus,
        };
      });
    },

    socketOptionChange(id, option) {
      this.setSocketBonusValues(id, option);
      this.emitChangeEvent();
    },

    socketOptionValueChange(value) {
      this.emitChangeEvent();
    },

    emitChangeEvent() {
      const sockets = this.selected.map(socket => {
        return socket.seletedValue * 50 + socket.option.index;
      });

      this.$emit("input", sockets);
      this.$emit("change", sockets);
    },
  },

  beforeMount() {
    for (let i = 0; i < 5; i++) {
      this.selected.push({
        option: {
          index: 255,
          name: "No socket",
          level: 0,
          element: 0,
          bonusType: 0,
          bonusValues: [0],
        },
        seletedValue: 0,
        values: [],
      });
    }

    this.selected.forEach((selected, id) => {
      this.setSocketBonusValues(id, selected.option);
    });
  },
};
</script>

<style lang="scss">
.socket-option-row {
  margin: 4px 0;
}

.socket-option-row:last-child {
  margin: 4px 0 0 0;
}

.sockets-options {
  margin-top: 10px;

  .socket-level {
    max-width: 100px;
    min-width: 100px;
  }
}
</style>
