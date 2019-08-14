<template>
  <v-app dark>
    <v-toolbar :color="`indigo lighten-1`" v-ripple>
      <v-layout class="nav-group" row justify-center>
        <v-btn to="/warehouse-page" flat v-ripple="false">
          <div class="v-btn-text">Warehouse</div>
          <chest-icon></chest-icon>
        </v-btn>

        <v-btn to="/inventory-page" flat v-ripple="false">
          <div class="v-btn-text">Inventory</div>
          <backpack-icon></backpack-icon>
        </v-btn>

        <v-btn to="/guilds-page" flat v-ripple="false">
          <div class="v-btn-text">Guilds</div>
          <guild-icon></guild-icon>
        </v-btn>

        <v-btn to="/accounts-page" flat v-ripple="false">
          <div class="v-btn-text">Accounts</div>
          <v-icon>mdi mdi-account-card-details</v-icon>
        </v-btn>

        <v-btn to="/account-page" flat v-ripple="false">
          <div class="v-btn-text">Account</div>
          <v-icon>mdi mdi-account-badge</v-icon>
        </v-btn>
      </v-layout>

      <v-btn to="/setup-page" icon class="setup-button">
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>

    <router-view></router-view>

    <v-footer dark height="auto">
      <v-card flat tile class="indigo lighten-1 white--text text-xs-center">
        <v-card-text>
          <v-tooltip top open-delay="0" close-delay="0">
            <template v-slot:activator="{ on }">
              <v-btn
                class="mx-3 white--text"
                icon
                v-on="on"
                @click="open('https://t.me/profesor08')"
              >
                <v-icon size="24px">mdi-telegram</v-icon>
              </v-btn>
            </template>
            <span>Telegram</span>
          </v-tooltip>
          <v-tooltip top open-delay="0" close-delay="0">
            <template v-slot:activator="{ on }">
              <v-btn
                class="mx-3 white--text"
                icon
                v-on="on"
                @click="open('mailto:online7890@gmail.com')"
              >
                <v-icon size="24px">mdi-email</v-icon>
              </v-btn>
            </template>
            <span>Email</span>
          </v-tooltip>
          <v-tooltip top open-delay="0" close-delay="0">
            <template v-slot:activator="{ on }">
              <v-btn
                class="mx-3 white--text"
                icon
                v-on="on"
                @click="open('https://github.com/Profesor08')"
              >
                <v-icon size="24px">mdi-github-circle</v-icon>
              </v-btn>
            </template>
            <span>GitHub</span>
          </v-tooltip>
          <v-tooltip top open-delay="0" close-delay="0">
            <template v-slot:activator="{ on }">
              <v-btn
                class="mx-3 white--text"
                icon
                v-on="on"
                @click="open('https://codepen.io/Profesor08')"
              >
                <v-icon size="24px">mdi-codepen</v-icon>
              </v-btn>
            </template>
            <span>CodePen</span>
          </v-tooltip>
          <v-tooltip top open-delay="0" close-delay="0">
            <template v-slot:activator="{ on }">
              <v-btn
                class="mx-3 white--text"
                icon
                v-on="on"
                @click="open('https://codesandbox.io/u/Profesor08')"
              >
                <codesandbox-icon></codesandbox-icon>
              </v-btn>
            </template>
            <span>CodeSandbox</span>
          </v-tooltip>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          Mu Editor is developed by
          <strong>Profesor08</strong> to help editing Mu Online database. It can edit account warehouse, inventory, characters, and etc.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          &copy; 2019 —
          <strong>Profesor08</strong>
        </v-card-text>
      </v-card>
    </v-footer>

    <v-snackbar
      v-model="snackbar.active"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      :top="true"
      :right="true"
      :vertical="snackbar.mode === 'vertical'"
    >
      {{snackbar.text}}
      <v-layout justify-end>
        <v-btn dark flat @click="snackbar.active = false">Close</v-btn>
      </v-layout>
    </v-snackbar>

    <context-menu></context-menu>
  </v-app>
</template>

<script>
import { ContextMenu } from "./components/ContextMenu";
import { connect } from "./lib/sql";

export default {
  name: "mu-editor",

  components: {
    ContextMenu,
  },

  data() {
    return {
      bottomNav: -1,

      snackbar: {
        active: false,
        color: "success",
        mode: "vertical",
        timeout: 10000,
        text: "",
      },
    };
  },

  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
  },

  async beforeMount() {
    this.$msg.register(this.snackbar);

    this.$router.beforeEach((to, from, next) => {
      localStorage.setItem("lastRoute", to.path);
      next();
    });

    try {
      await connect({
        ...this.$store.state.Config.currentServer,
      });

      const lastRoute = localStorage.getItem("lastRoute");

      if (lastRoute) {
        this.$router.push(lastRoute);
      } else {
        this.$router.push("accounts-page");
      }
    } catch (err) {
      this.$router.push("setup-page");
    }
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
.v-item-group.v-bottom-nav {
  box-shadow: none;
}

.v-btn {
  &.setup-button {
    margin: 6px 0 6px auto !important;
  }
}
</style>

<style lang="scss">
.nav-group {
  height: 100%;

  .v-btn {
    height: 100%;
    width: 88px;
    margin: 0;

    &.v-btn--active {
      width: 120px;

      .v-icon {
        transform: translateY(0) translateZ(0);
      }

      .v-btn-text {
        transform: scale(1) translateZ(0);
      }
    }

    .v-btn__content {
      display: flex;
      flex-direction: column;
    }

    .v-icon {
      order: 1;
      transform: translateY(10px) translateZ(0);
      transition: ease all 0.2s;
    }

    .v-btn-text {
      order: 2;
      font-size: 13px;
      font-weight: 300;
      white-space: nowrap;
      text-transform: initial;
      height: 20px;
      transform: scale(0) translateZ(0);
      transition: ease all 0.2s;
    }
  }
}
</style>