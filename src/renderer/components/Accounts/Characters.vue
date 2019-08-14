<template>
  <v-layout class="account-characters" column>
    <v-subheader>Characters</v-subheader>

    <v-data-table class="characters-list" :headers="headers" :items="items" :loading="false">
      <template v-slot:items="props">
        <td>
          <v-btn :to="`inventory-page/${props.item.name}`" flat icon>
            <backpack-icon></backpack-icon>
          </v-btn>
        </td>
        <td>{{ props.item.name }}</td>
        <td>{{ charClass(props.item.class) }}</td>
        <td>{{props.item.level + props.item.master}}</td>
        <td>{{ props.item.resets }}</td>
        <td>{{ props.item.grands }}</td>
        <td>{{ props.item.money }}</td>
        <td>{{ props.item.map }}</td>
        <td>{{ props.item.pk }}</td>
        <td>{{ props.item.control }}</td>
        <td>{{ props.item.str }}</td>
        <td>{{ props.item.agi }}</td>
        <td>{{ props.item.vit }}</td>
        <td>{{ props.item.ene }}</td>
        <td>{{ props.item.com }}</td>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
import { CharClass } from "../../../config";

export default {
  name: "characters",

  props: {
    characters: Array,
    to: String,
  },

  data() {
    return {
      headers: [
        { text: "Actions", value: "constrol-buttons", sortable: false },
        { text: "Name", align: "left", value: "name" },
        { text: "Level", value: "level" },
        { text: "Res", value: "resets" },
        { text: "Gr", value: "grands" },
        { text: "Class", value: "class" },
        { text: "Money", value: "money" },
        { text: "Map", value: "map" },
        { text: "Pk", value: "pk" },
        { text: "Control", value: "control" },
        { text: "Strength", value: "str" },
        { text: "Agility", value: "agi" },
        { text: "Vitality", value: "vit" },
        { text: "Energy", value: "ene" },
        { text: "Command", value: "com" },
      ],
    };
  },

  computed: {
    items() {
      if (Array.isArray(this.characters)) {
        return this.characters;
      }

      return [];
    },
  },

  methods: {
    charClass(code) {
      return CharClass.byCode(code);
    },
  },

  mounted() {},
};
</script>

<style lang="scss">
.account-characters {
  padding: 10px 0;

  .v-subheader {
    padding: 0 8px;
  }

  .v-table__overflow {
    max-width: calc(100vw - 20px);
  }

  .characters-list {
    thead {
      tr {
        height: auto;

        th {
          height: auto;
          padding: 8px !important;
        }
      }
    }

    td {
      padding: 0 8px !important;
    }

    .v-datatable__progress {
      display: none;
    }
  }
}
</style>
