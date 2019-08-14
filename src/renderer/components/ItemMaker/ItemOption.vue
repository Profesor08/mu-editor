<template>
  <div>
    <div class="group-label">Option</div>
    <v-radio-group class="scrollable-list" :value="value" @change="changeHandler">
      <v-radio v-for="(n, index) in 8" :key="index" :label="index.toString()" :value="index"></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: "item-option",

  props: {
    value: Number,
  },

  methods: {
    changeHandler(e) {
      this.$emit("input", e);
      this.$emit("change", e);
    },
  },
};
</script>

<style>
</style>
