<template>
  <i class="v-icon">
    <slot></slot>
  </i>
</template>

<script>
export default {
  name: "svg-icon",
};
</script>

<style lang="scss" scoped>
.v-icon {
  height: 24px;

  svg {
    width: auto;
    height: 100%;
    fill: currentColor;
    stroke: currentColor;
  }
}
</style>
