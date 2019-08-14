<template>
  <div class="item-element">
    <div class="group-label">Element</div>
    <v-layout>
      <v-select
        class="dense-select"
        label="Option"
        :items="elements"
        :item-text="elementName"
        v-model="element"
        return-object
        dense
        single-line
        @input="optionChangeHandler"
      ></v-select>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "item-element",

  props: {
    item: Object,
    value: Object,
  },

  data() {
    return {
      element: {
        option: 0,
        level: 0,
      },
      elements: [
        {
          option: 0,
          level: 0,
        },
        {
          option: 1,
          level: 1,
        },
        {
          option: 1,
          level: 2,
        },
        {
          option: 1,
          level: 3,
        },
        {
          option: 1,
          level: 4,
        },
        {
          option: 1,
          level: 5,
        },
      ],
    };
  },

  methods: {
    elementName(element) {
      switch (element.level) {
        case 0:
          return "No Element";
        case 1:
          return "Fire Element";
        case 2:
          return "Water Element";
        case 3:
          return "Earth Element";
        case 4:
          return "Wind Element";
        case 5:
          return "Darkness Element";
      }
    },

    optionChangeHandler() {
      this.$emit("input", this.element);
      this.$emit("change", this.element);
    },
  },

  beforeMount() {
    this.optionChangeHandler();
  },
};
</script>

<style lang="scss">
.item-element {
  margin-top: 10px;
}
</style>
