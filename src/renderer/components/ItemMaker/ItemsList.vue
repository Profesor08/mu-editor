<template>
  <div>
    <div class="group-label">Items</div>
    <v-radio-group class="scrollable-list" :value="value" @change="changeHandler">
      <v-radio v-for="(item, index) in items" :key="index" :label="item.Name" :value="item.Index">
        <div class="label-text" slot="label">{{item.Name}}</div>
      </v-radio>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: "items-list",

  props: {
    items: Object,
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
