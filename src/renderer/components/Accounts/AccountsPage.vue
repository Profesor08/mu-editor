<template>
  <v-layout>
    <v-card>
      <v-card-title>
        Accounts
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>

      <accounts :accounts="accounts" :search="search"></accounts>
    </v-card>
  </v-layout>
</template>

<script>
import { getAccounts } from "../../lib/account";
import Accounts from "./Accounts";

export default {
  name: "accounts-page",

  components: { Accounts },

  data() {
    return {
      search: "",
      headers: [
        { text: "Actions", value: "constrol-buttons", sortable: false },
        { text: "Account", align: "left", value: "account" },
        { text: "Password", value: "password" },
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Block Code", value: "block" },
        { text: "Control Code", value: "control" },
      ],
      accounts: [],
      rowsPerPageItems: [
        50,
        200,
        500,
        { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 },
      ],
    };
  },

  methods: {
    async loadAccounts() {
      try {
        const response = await getAccounts();

        this.accounts = Array.from(response.recordset);
      } catch (err) {
        this.$msg.error(err.message);
      }
    },

    async getCharacters() {},
  },

  async beforeMount() {
    await this.loadAccounts();
  },
};
</script>

<style lang="scss" acoped>
</style>
