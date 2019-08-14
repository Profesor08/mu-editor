<template>
  <div class="context-menu-item" @click="$emit('click')" v-ripple>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "context-menu-item",
};
</script>

<style lang="scss">
.context-menu-item {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background: rgba(255, 255, 255, 1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: black;

  .v-icon {
    margin: 0 5px 0 -5px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.12);
    cursor: pointer;
  }
}
</style>
