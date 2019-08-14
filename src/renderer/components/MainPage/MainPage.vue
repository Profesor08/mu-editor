<template>
  <div class="main">
    <v-card>
      <v-card-title>
        Characters
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="characters"
        :search="search"
        :rows-per-page-items="rowsPerPageItems"
      >
        <template v-slot:items="props">
          <td>{{ props.item.account }}</td>
          <td>{{ props.item.character }}</td>
          <td>{{ props.item.level }}</td>
          <td>{{ props.item.resets }}</td>
          <td>{{ props.item.grands }}</td>
        </template>
        <v-alert
          v-slot:no-results
          :value="true"
          color="error"
          icon="warning"
        >Your search for "{{ search }}" found no results.</v-alert>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import mssql from "mssql";

async function connect() {
  return await new mssql.ConnectionPool({
    user: "profesor08",
    password: "123456",
    server: "127.0.0.1",
    port: 1433,
    database: "MuOnline",
  }).connect();
}

export default {
  name: "main-page",

  data() {
    return {
      search: "",
      headers: [
        {
          text: "Account",
          align: "left",
          sortable: false,
          value: "account",
        },
        { text: "Character", value: "character" },
        { text: "Level", value: "level" },
        { text: "Resets", value: "resets" },
        { text: "Grand Resets", value: "grands" },
      ],
      characters: [],
      rowsPerPageItems: [
        50,
        200,
        500,
        { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 },
      ],
    };
  },

  computed: {
    color() {
      switch (this.bottomNav) {
        case 0:
          return "blue-grey";
        case 1:
          return "teal";
        case 2:
          return "brown";
        case 3:
          return "indigo";
      }
    },
  },

  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
  },

  async mounted() {
    // (async () => {
    //   const sql = await connect();
    //   const response = await sql.query(`
    //   SELECT
    //     AccountID as account,
    //     Name as character,
    //     cLevel as level,
    //     RESETS as resets,
    //     GrandResets as grands
    //   FROM Character
    // `);
    //   this.characters = response.recordset;
    // })();
  },
};
</script> 

<style lang="scss">
.v-card {
  width: 100%;
}

.v-icon {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}

.v-item-group {
  .v-btn {
    .v-btn__content {
      span {
        font-size: 14px;
        color: white !important;
        opacity: 0;
        transform: scale(0) translateZ(0);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
      }
    }

    &.v-btn--active {
      span {
        opacity: 1;
        transform: scale(1) translateZ(0);
      }
    }
  }
}
</style>
