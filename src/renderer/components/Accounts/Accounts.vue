<template>
  <v-layout>
    <v-flex>
      {{search.lenght}}
      <v-data-table
        :headers="headers"
        :items="accounts"
        :search="search"
        :rows-per-page-items="rowsPerPageItems"
        class="accounts-list"
      >
        <template v-slot:items="props">
          <tr :class="{'is-active': props.item.account === account}">
            <td>
              <v-btn :to="`warehouse-page/${props.item.account}`" flat icon>
                <chest-icon></chest-icon>
              </v-btn>
            </td>
            <td>
              <span
                class="account"
                @click="() => selectAccount(props.item.account)"
              >{{ props.item.account }}</span>
            </td>
            <td>{{ props.item.password }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.email }}</td>
            <td>{{ props.item.block }}</td>
            <td>{{ props.item.control }}</td>
          </tr>
          <tr v-if="props.item.account === account" :style="{background: 'transparent'}">
            <td v-bind:colspan="headers.length">
              <characters :characters="characters"></characters>
            </td>
          </tr>
        </template>
        <v-alert
          v-slot:no-results
          :value="true"
          color="error"
          icon="warning"
        >Your search for "{{ search }}" found no results.</v-alert>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { getCharacters } from "../../lib/account";
import Characters from "./Characters";

export default {
  name: "accounts",

  props: { accounts: Array, search: String },

  components: { Characters },

  data() {
    return {
      headers: [
        { text: "Actions", value: "constrol-buttons", sortable: false },
        { text: "Account", align: "left", value: "account" },
        { text: "Password", value: "password" },
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Block Code", value: "block" },
        { text: "Control Code", value: "control" },
      ],
      rowsPerPageItems: [
        50,
        200,
        500,
        { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 },
      ],
      account: "",
    };
  },

  asyncComputed: {
    async characters() {
      if (this.account.length > 0) {
        const response = await getCharacters(this.account);

        return Array.from(response.recordset);
      }

      return [];
    },
  },

  methods: {
    selectAccount(account) {
      this.account = account;
      this.$emit("input", account);
    },
  },

  beforeMount() {
    const account = localStorage.getItem("lastAccount");

    if (account) {
      this.account = account;
    }
  },
};
</script>

<style lang="scss" acoped>
.accounts-list {
  td,
  th {
    padding: 0 8px !important;
  }

  tr.is-active {
    background: #616161 !important;
  }
}

.account {
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
