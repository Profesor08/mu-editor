import Vue from "vue";
import axios from "axios";
import App from "./App";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify";
import AsyncComputed from "vue-async-computed";
import VueNoty from "vuejs-noty";
import {
  CodeSandboxIcon,
  GuildIcon,
  BackpackIcon,
  ChestIcon,
} from "./components/Icons";

import "../scss/main.scss";

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.axios = Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

const Msg = {
  install(Vue) {
    let snackbar = {};

    const show = (text, type) => {
      snackbar.color = type;
      snackbar.text = text;
      snackbar.active = true;
    };

    Vue.prototype.$msg = {
      register(targetSnackbar) {
        snackbar = targetSnackbar;
      },

      success: text => {
        show(text, "success");
      },

      error: text => {
        show(text, "error");
      },

      warn: text => {
        show(text, "warning");
      },

      info: text => {
        show(text, "info");
      },
    };
  },
};

Vue.use(Msg);
Vue.use(AsyncComputed);
Vue.use(Vuetify);
Vue.use(VueNoty);
Vue.component("codesandbox-icon", CodeSandboxIcon);
Vue.component("guild-icon", GuildIcon);
Vue.component("backpack-icon", BackpackIcon);
Vue.component("chest-icon", ChestIcon);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app");
