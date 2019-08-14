<template>
  <div class="harmony-options">
    <div class="group-label">Harmony</div>
    <v-layout>
      <v-select
        class="dense-select"
        label="Option"
        :items="options"
        :item-text="harmonyOptionName"
        v-model="option"
        return-object
        dense
        single-line
        @input="optionChangeHandler"
      ></v-select>
      <v-select
        class="dense-select harmony-level"
        :items="levels"
        v-model="effect"
        :item-text="harmonyOptionValue"
        item-value="id"
        label="Value"
        dense
        single-line
        @input="levelChangeHandler"
      ></v-select>
    </v-layout>
  </div>
</template>

<script>
import { Harmony } from "../../lib/item/Harmony";

export default {
  name: "item-harmony",

  props: {
    value: Object,
    item: Object,
  },

  data() {
    return {
      levels: [],
      effect: 0,
      option: null,
    };
  },

  computed: {
    options() {
      const options = Harmony.getGroupOptions(this.item.group) || [];

      options.unshift({
        index: 0,
        name: "No option",
        effects: [
          {
            id: 0,
            value: 0,
          },
        ],
      });

      return options;
    },
  },

  methods: {
    getEventData() {
      return {
        option: this.option.index,
        level: this.effect,
      };
    },

    optionChangeHandler() {
      this.updateLevels();

      this.$emit("input", this.getEventData());
      this.$emit("change", this.getEventData());
    },

    levelChangeHandler() {
      this.$emit("input", this.getEventData());
      this.$emit("change", this.getEventData());
    },

    harmonyOptionName(option) {
      return option.name.replace("+%d", "");
    },

    harmonyOptionValue(data) {
      let effect = this.option.effects[data.id];

      if (effect) {
        return `+${effect.value}`;
      }

      return `level: ${data.id}`;
    },

    updateLevels() {
      this.levels = this.option.effects.map((effect, id) => {
        return {
          id: id,
        };
      });

      if (this.effect > this.levels.length - 1) {
        this.effect = this.levels[this.levels.length - 1].id;
      }
    },
  },

  beforeMount() {
    this.option = this.options[0];
    this.updateLevels();
  },
};
</script>

<style lang="scss">
.harmony-options {
  margin-top: 10px;

  .harmony-level {
    max-width: 70px;
    min-width: 70px;
  }
}
</style>
