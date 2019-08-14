<template>
  <div class="cell" @click="clickHandler">
    <v-progress-circular v-show="loading" indeterminate color="primary" size="25" width="3"></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: "item-cell",

  props: {
    x: Number,
    y: Number,
    offset: Number,
  },

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    async clickHandler(e) {
      this.loading = true;

      this.$emit("click", {
        x: this.x,
        y: this.y,
        offset: this.offset,
        stopLoading: () => {
          this.loading = false;
        },
      });
    },
  },
};
</script>

<style lang="scss">
.cell {
  position: relative;

  .v-progress-circular {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
