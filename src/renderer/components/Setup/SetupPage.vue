<template>
  <v-layout align-center>
    <v-layout wrap justify-space-around>
      <v-flex xs10 sm5>
        <v-subheader>Servers list</v-subheader>

        <v-list two-line class="servers-list" ref="serversList">
          <template v-for="(server, index) in servers">
            <v-list-tile
              :class="{'is-active': server.id === selectedServer.id}"
              :key="server.id"
              @click="selectServer(server, index)"
              :ref="server.id === selectedServer.id ? `selectedServerElement` : `serverElement-${index}`"
            >
              <v-list-tile-content>
                <v-list-tile-title>
                  Host:
                  <span class="server-data">{{ server.server }}:{{ server.port }}</span>
                </v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">
                  Database:
                  <span class="server-data">{{ server.database }}</span>
                </v-list-tile-sub-title>
                <v-list-tile-sub-title>
                  User:
                  <span class="server-data">{{ server.user }}</span>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon
                  :class="{'is-active': server.id === selectedServer.id}"
                  :color="server.id === selectedServer.id ? 'light-blue darken-1' : 'grey darken-2'"
                >fiber_manual_record</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index < servers.length - 1" :key="index"></v-divider>
          </template>
        </v-list>
      </v-flex>

      <v-flex xs10 sm5 class="selected-server">
        <v-subheader>Selected Server:</v-subheader>

        <v-text-field
          v-model="selectedServer.server"
          label="Host"
          :rules="[rules.required]"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="selectedServer.port"
          label="Port (default: 1433)"
          type="number"
          :rules="[rules.required]"
          required
        ></v-text-field>

        <v-text-field
          v-model="selectedServer.database"
          label="Database"
          :rules="[rules.required]"
          required
        ></v-text-field>

        <v-text-field v-model="selectedServer.user" label="User" :rules="[rules.required]" required></v-text-field>

        <v-text-field
          label="Password"
          v-model="selectedServer.password"
          :append-icon="showPassword ? 'visibility' : 'visibility_off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          :rules="[rules.required]"
          required
        ></v-text-field>

        <v-layout row class="buttons-group buttons-group-small">
          <v-btn color="error" small @click="deleteServer">Delete</v-btn>
          <v-btn color="warning" small @click="addNewServer">New</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :loading="btn.connect.loading"
            color="success"
            small
            @click="connectToServer"
          >Connect</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
// import mssql from "mssql";

import { connect, getActiveConnection } from "../../lib/sql.js";
import { setTimeout, setInterval } from "timers";

export default {
  name: "setup-page",

  data() {
    return {
      btn: {
        connect: {
          loading: false,
        },
      },
      selectedServer: null,
      showPassword: false,
      rules: {
        required: value => !!value || "Required.",
      },
    };
  },

  computed: {
    servers() {
      return this.$store.state.Config.servers.map(server => {
        return {
          ...server,
        };
      });
    },

    currentServer() {
      return {
        ...this.$store.state.Config.currentServer,
      };
    },
  },

  methods: {
    selectServer(server, index) {
      this.selectedServer = {
        ...server,
      };

      this.$store.dispatch("setCurrentServer", {
        server,
      });
    },

    async addNewServer() {
      await this.$store.dispatch("addServer", {
        server: {
          ...this.selectedServer,
        },
      });

      this.selectedServer = this.currentServer;

      this.scrollToServer();
    },

    async deleteServer() {
      await this.$store.dispatch("deleteServer", {
        server: {
          ...this.selectedServer,
        },
      });

      this.selectedServer = this.currentServer;
    },

    async connectToServer() {
      this.btn.connect.loading = true;

      try {
        await connect(this.selectedServer);
        console.log(this.selectedServer);

        await this.$store.dispatch("updateServer", {
          server: {
            ...this.selectedServer,
          },
        });

        this.$router.push("accounts-page");
      } catch (err) {
        console.warn(err);
        this.$msg.error(err.message);
      }

      this.btn.connect.loading = false;
    },

    scrollToServer() {
      const selectedServerElement = this.$refs.selectedServerElement[0];
      const serversList = this.$refs.serversList;

      if (selectedServerElement && serversList) {
        const offsetTop =
          selectedServerElement.$el.offsetTop +
          selectedServerElement.$el.offsetHeight;
        serversList.$el.scrollTop = offsetTop;
        console.log(offsetTop);
      }

      console.log(selectedServerElement);
      console.log(serversList);
      console.log(this.$refs);
    },
  },

  beforeMount() {
    this.selectedServer = {
      ...this.$store.state.Config.currentServer,
    };
  },

  mounted() {},
};
</script>

<style lang="scss">
.servers-list {
  max-height: 390px;
  overflow-y: auto;
  position: relative;
}

.selected-server {
  .v-subheader {
    padding: 0;
  }
}

.server-data {
  color: #5195b5;
  font-style: italic;
}

.v-list__tile.theme--dark {
  &:hover,
  &.is-active {
    background-color: rgba(255, 255, 255, 0.08);
    cursor: pointer;
  }
}
</style>

