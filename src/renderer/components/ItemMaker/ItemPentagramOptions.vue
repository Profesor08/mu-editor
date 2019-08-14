<template>
  <div class="item-pentagram-options">
    <div class="group-label">Pentagram Slots</div>
    <v-layout v-for="id in [0,1,2,3,4]" :key="`pentagram-slot-${id}`" :data-t="id">
      <v-select
        class="dense-select"
        label="Option"
        :items="slots[id].values"
        :item-text="v => pentagramSlotName({id, value: v.id})"
        item-value="id"
        v-model="slots[id].value"
        dense
        single-line
        @input="optionChangeHandler"
      ></v-select>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "item-pentagram-options",

  props: {
    item: Object,
    value: Array,
  },

  data() {
    return {
      slots: [
        {
          values: [
            {
              id: 255,
            },
            {
              id: 254,
            },
          ],
          value: 255,
        },
        {
          values: [
            {
              id: 255,
            },
            {
              id: 254,
            },
          ],
          value: 255,
        },
        {
          values: [
            {
              id: 255,
            },
            {
              id: 254,
            },
          ],
          value: 255,
        },
        {
          values: [
            {
              id: 255,
            },
            {
              id: 254,
            },
          ],
          value: 255,
        },
        {
          values: [
            {
              id: 255,
            },
            {
              id: 254,
            },
          ],
          value: 255,
        },
      ],
    };
  },

  methods: {
    optionChangeHandler() {
      const slots = this.slots.map(slot => slot.value);

      this.$emit("input", slots);
      this.$emit("change", slots);
    },

    pentagramSlotName(slot) {
      const errtel = id => {
        switch (id) {
          case 0:
            return "Empty Slot of Angler";
          case 1:
            return "Empty Slot of Blessing";
          case 2:
            return "Empty Slot of Integrity";
          case 3:
            return "Empty Slot of Divinity";
          case 4:
            return "Empty Slot of Gale";
        }

        return "Unknown Empty Errtel Slot";
      };

      if (slot.value === 254) {
        return errtel(slot.id);
      }

      return "No slot";
    },
  },

  beforeMount() {
    this.optionChangeHandler();
  },
};
</script>

<style lang="scss">
.pentagram-option-row {
  margin: 4px 0;
}

.pentagram-option-row:last-child {
  margin: 4px 0 0 0;
}

.item-pentagram-options {
  margin-top: 10px;
  $size: 24px;

  .v-select.v-text-field.pentagram-option-select {
    margin: 0;
    padding: 0;
    font-size: 11px;

    &:not(:last-child) {
      margin-right: 16px;
    }

    input {
      height: $size;
    }

    .v-input__slot {
      margin: 0;
    }

    .v-text-field__details {
      display: none;
    }

    .v-select__selection--comma {
      margin: 0;
      color: hsla(0, 0%, 100%, 0.7);
    }

    .v-input__append-inner {
      margin: 0;
    }

    .v-input__icon {
      height: $size;
      min-width: $size;
      width: $size;
    }
  }

  .pentagram-option-level {
    max-width: 100px;
    min-width: 100px;
  }

  .v-select__selections {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .v-select__selection {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
