<template>
  <div>
    <div class="group-label">Excellent</div>
    <v-checkbox
      v-for="(option, id) in excellentOptions"
      :key="`exc-${id}`"
      v-model="excellent"
      :label="option.Text"
      :value="option.Number"
      @change="changeHandler"
    >
      <div class="label-text" slot="label" :title="option.Text">{{option.Text}}</div>
    </v-checkbox>
  </div>
</template>

<script>
import { Item, ItemsData, Excellent } from "../../lib/item";

export default {
  name: "item-excellent",

  props: {
    item: Object,
    value: Array,
  },

  data() {
    return {
      excellent: [],
    };
  },

  computed: {
    excellentOptions() {
      const options = new Array(6).fill(0).map((_, id) => {
        return {
          Number: id,
          Text: "unknown",
        };
      });

      try {
        const item = new Item(Item.createItemBytes(this.item));

        if (!item.isEmpty()) {
          Excellent.getAvailableOptions(item).forEach((option, index) => {
            if (option.Number <= 5) {
              options[option.Number] = {
                ...option,
                Text: Excellent.getOptionText(item, option),
              };
            }
          });
        }
      } catch (err) {
        console.warn(err);
      }

      return options;
    },
  },

  methods: {
    changeHandler(e) {
      this.$emit("input", this.excellent);
      this.$emit("change", e);
    },
  },
};
</script>

<style>
</style>
