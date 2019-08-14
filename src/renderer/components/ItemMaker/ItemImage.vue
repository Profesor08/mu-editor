<template>
  <div>
    <div class="group-label">Image</div>
    <div class="image-container">
      <img
        class="item-image"
        v-if="itemImage"
        :src="itemImage.url"
        :style="{width: `${itemImage.x}px`, height: `${itemImage.y}px`}"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "item-image",

  props: {
    item: Object,
  },

  asyncComputed: {
    async itemImage() {
      return {
        url: await this.item.getImage(),
        x: this.item.data["Width"] * 30,
        y: this.item.data["Height"] * 30,
      };
    },
  },
};
</script>

<style>
</style>
