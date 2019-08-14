<template>
  <div>
    <div class="group-label">Group</div>
    <v-radio-group class="scrollable-list" :value="value" @change="changeHandler">
      <v-radio v-for="(group, index) in groups" :key="index" :label="group" :value="index"></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: "item-group",

  props: {
    groups: Array,
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
