<template>
  <div
    class="mu-item"
    :class="{'is-loading': loading}"
    data-type="mu-item"
    :data-offset="item.offset"
    :data-x="item.x"
    :data-y="item.y"
    :data-width="item.width"
    :data-height="item.height"
    @mouseenter="popupShow"
    @mouseleave="popupHide"
    @mousemove="popupMove"
  >
    <img class="mu-item-image" :src="image">
    <v-progress-circular v-show="loading" indeterminate color="primary" size="25" width="3"></v-progress-circular>
    <div
      class="item-popup"
      ref="popup"
      :class="{'is-active': popup.active}"
      :style="{'top': popup.y + popup.offsetY + 'px', 'left': popup.x + popup.offsetX + 'px'}"
      v-html="item.item.getInfo()"
    ></div>
  </div>
</template>

<script>
import { Item } from "../../lib/item/Item";

export default {
  name: "mu-item",

  props: {
    item: {
      offset: String,
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      item: Item,
    },

    account: String,
    storage: String,
    onBeforeItemDeleting: Function,
    onItemDeleted: Function,
    onItemAdded: Function,
  },

  data() {
    return {
      popup: {
        active: false,
        x: -99999,
        y: 0,
        offsetX: 0,
        offsetY: 0,
      },

      loading: false,
    };
  },

  asyncComputed: {
    async image() {
      return await this.item.item.getImage();
    },
  },

  methods: {
    popupShow(e) {
      const rect = e.target.getBoundingClientRect();
      const popupRect = this.$refs.popup.getBoundingClientRect();

      this.popup.active = true;

      let x = rect.left - popupRect.width / 2 + rect.width / 2;
      let y = rect.top + rect.height;

      if (x + popupRect.width > window.innerWidth) {
        x = x - (x + popupRect.width - window.innerWidth);
      }

      if (y + popupRect.height > window.innerHeight) {
        y = y - (y + popupRect.height - window.innerHeight);
      }

      if (x < 0) {
        x = 0;
      }

      this.popup.x = x;
      this.popup.y = y;
    },

    popupHide(e) {
      this.popup.active = false;
      this.popup.x = -99999;
    },

    popupMove(e) {
      // console.log(e);
    },
  },

  mounted() {
    this.$el.item = this.item.item;
    this.$el.account = this.account;
    this.$el.storage = this.storage;
    this.$el.onItemDeleted = async () => {
      if (this.onItemDeleted) {
        await this.onItemDeleted();
      }

      this.loading = false;
    };
    this.$el.onBeforeItemDeleting = () => {
      this.loading = true;
    };
  },
};
</script>

<style lang="scss">
.mu-item {
  position: relative;

  &.is-loading {
    .mu-item-image {
      opacity: 0.8;
      filter: grayscale(70%);
    }
  }

  .mu-item-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center center;
  }

  .v-progress-circular {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .item-popup {
    position: fixed;
    z-index: 1000;
    background: rgba(35, 37, 37, 0.9);
    border: 1px solid #555555;
    padding: 10px;
    color: var(--text-color);
    pointer-events: none;
    font-size: 12px;
    white-space: nowrap;
    transform: translateY(10px) translateZ(0);

    $time: 0.2s;

    transition: ease 0s left, ease $time transform, ease $time opacity;
    transition-delay: $time, 0s, 0s;
    opacity: 0;

    &.is-active {
      transform: translateY(0) translateZ(0);
      transition-delay: 0s, 0s, 0s;
      opacity: 1;
    }
  }
}

$color-ancient-old: #00ffff;
$color-normal: #ffffff;
$color-option: #9aadd5;
$color-excellent: #1ae685;
$color-name-lvl3: #cc9933;
$color-name-lvl5: #cc9933;
$color-name-lvl7: #f4cb3f;
$color-ancient: #00ff00;
$color-special: rgba(255, 215, 0, 1);
$color-socket-name: #9966ff;
$color-socket-option-info: #ff00ff;
$color-socket-empty: #c9c9c9;
$color-equip-class: #a40000;
$color-harmony-option: #fff500;
$color-errtel-rank: #ffffff;
$color-errtel-option: #9aadd5;

.mu-item-info {
  text-align: center;
  font-size: 12px;
  //background-color: rgba(0, 0, 0, 0);
  color: #808080;

  .debug-info {
    margin: 10px 0;
  }

  .items-stats {
    color: $color-normal;

    &.wizardry-increase {
      color: $color-option;
    }
  }

  .equip-class {
    margin: 10px 0;

    .equip-class-name {
      color: $color-equip-class;
    }

    + .ancient-additional-stats {
      margin: -10px 0 10px 0;
    }
  }

  .refinery-options {
    margin: 10px 0;

    .refinery-option {
      color: #d88af6;
    }
  }

  .harmony-options {
    margin: 10px 0;

    .harmony-option {
      color: $color-harmony-option;
    }
  }

  .ancient-additional-stats {
    margin: 0 0 10px 0;
    color: $color-option;
  }

  .item-skill-option {
    color: $color-option;
  }

  .item-luck-option {
    color: $color-option;
  }

  .item-additional-option {
    color: $color-option;
  }

  .item-excellent-options {
    margin: 10px 0;

    .item-excellent-option {
      color: $color-option;
    }
  }

  .item-socket-options {
    .item-socket-options-info {
      margin: 10px 0;
      color: $color-socket-option-info;
    }

    .item-socket-option {
      color: $color-option;
    }

    .item-socket-empty {
      color: $color-socket-empty;
    }

    .item-socket-bonus-option {
      color: $color-option;
    }
  }

  .item-errtel-element {
    &.element-fire {
      color: #ef1739;
    }

    &.element-water {
      color: #668cc6;
    }

    &.element-earth {
      color: #c7a014;
    }

    &.element-wind {
      color: #01bd01;
    }

    &.element-darkness {
      color: #9c30bd;
    }
  }

  .item-errtel {
    margin: 10px 0;

    .errtel-rank {
      color: $color-errtel-rank;
    }

    .item-errtel-option {
      .option-rank {
        color: $color-errtel-rank;
      }

      .option-name {
        color: $color-errtel-option;
      }
    }
  }

  .pentagram-errtel-slots {
    margin: 10px 0;

    .pentagram-errtel-slot {
      .errtel-slot-type {
        color: $color-errtel-rank;
      }

      .errtel-slot-name {
        color: $color-errtel-option;
      }
    }
  }
}

.mu-item-name {
  .name-ancient {
    color: $color-ancient;
  }

  .name-normal {
    color: $color-normal;
  }

  .name-special {
    color: $color-special;
  }

  .name-excellent {
    color: $color-excellent;
  }

  .name-option {
    color: $color-option;
  }

  .name-lvl3 {
    color: $color-name-lvl3;
  }

  .name-lvl5 {
    color: $color-name-lvl5;
  }

  .name-lvl7 {
    color: $color-name-lvl7;
  }

  .name-socket {
    color: $color-socket-name;
  }
}
</style>
