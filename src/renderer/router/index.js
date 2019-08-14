import Vue from "vue";
import Router from "vue-router";
import { MainPage } from "../components/MainPage";
import { WarehousePage } from "../components/Warehouse";
import { InventoryPage } from "../components/Inventory";
import { GuildsPage } from "../components/Guilds";
import { SetupPage } from "../components/Setup";
import { AccountsPage } from "../components/Accounts";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: SetupPage,
    },
    {
      path: "/main-page",
      component: MainPage,
    },
    {
      path: "/accounts-page",
      component: AccountsPage,
    },
    {
      path: "/warehouse-page/:account",
      component: WarehousePage,
    },
    {
      path: "/warehouse-page",
      component: WarehousePage,
    },
    {
      path: "/inventory-page/:account",
      component: InventoryPage,
    },
    {
      path: "/inventory-page",
      component: InventoryPage,
    },
    {
      path: "/guilds-page",
      component: GuildsPage,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
