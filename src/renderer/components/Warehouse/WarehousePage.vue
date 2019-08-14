<template>
  <v-layout align-start wrap>
    <v-flex class="account-warehouse-page" sm12 md7>
      <v-subheader>Account: {{account}}</v-subheader>

      <v-layout align-center>
        <v-subheader>Money:</v-subheader>
        <v-text-field
          type="number"
          label="from 0 to 2000000000"
          v-model="money"
          min="0"
          max="2000000000"
          step="1"
        ></v-text-field>
        <v-btn color="success" flat icon @click="saveMoney">
          <v-icon>save</v-icon>
        </v-btn>
        <v-btn color="info" flat icon @click="reload">
          <v-icon>autorenew</v-icon>
        </v-btn>
      </v-layout>

      <v-layout align-start justify-start wrap>
        <div class="warehouse-container">
          <v-layout class="warehouse-controls">
            <v-btn color="info" flat icon title="Reload" @click="reload">
              <v-icon>autorenew</v-icon>
            </v-btn>
            <v-btn
              color="warning"
              flat
              icon
              title="Repair"
              :disabled="!isWarehouseAvailable"
              @click="repair"
            >
              <v-icon class="build-icon">build</v-icon>
            </v-btn>
            <v-btn
              color="error"
              flat
              icon
              title="Clear"
              :disabled="!isWarehouseAvailable"
              @click="clear"
            >
              <v-icon>mdi mdi-eraser</v-icon>
            </v-btn>
            <v-btn
              color="success"
              flat
              icon
              title="Create"
              :disabled="isWarehouseAvailable"
              @click="create"
            >
              <v-icon>mdi mdi-briefcase-plus-outline</v-icon>
            </v-btn>
          </v-layout>
          <v-subheader>Main warehouse</v-subheader>
          <items-grid
            :x="8"
            :y="15"
            :start="0"
            :end="warehouseItems.length / 2"
            :bytes="warehouseItems.length / 2 / 120"
            :items="warehouseItems"
            :account="account"
            :item="item"
            :onItemDeleted="onItemDeleted"
            :onItemAdded="onItemAdded"
            :isAvailable="isWarehouseAvailable"
          ></items-grid>
        </div>
        <div class="warehouse-container">
          <v-layout class="warehouse-controls">
            <v-btn
              color="error"
              flat
              icon
              title="Lock"
              :disabled="!isWarehouseAvailable || !isWarehouseExpanded"
              @click="lockExpandedWarehouse"
            >
              <v-icon>mdi mdi-lock-outline</v-icon>
            </v-btn>
            <v-btn
              color="success"
              flat
              icon
              title="Unlock"
              :disabled="!isWarehouseAvailable || isWarehouseExpanded"
              @click="unlockExpandedWarehouse"
            >
              <v-icon>mdi mdi-lock-open-outline</v-icon>
            </v-btn>
          </v-layout>
          <v-subheader>
            Expanded warehouse
            <span v-show="isWarehouseAvailable && !isWarehouseExpanded">(Locked)</span>
          </v-subheader>
          <items-grid
            :x="8"
            :y="15"
            :start="warehouseItems.length / 2"
            :end="warehouseItems.length"
            :bytes="warehouseItems.length / 2 / 120"
            :items="warehouseItems"
            :account="account"
            :item="item"
            :onItemDeleted="onItemDeleted"
            :onItemAdded="onItemAdded"
            :isAvailable="isWarehouseAvailable && isWarehouseExpanded"
          ></items-grid>
        </div>
      </v-layout>
    </v-flex>
    <v-flex class="item-maker-container" sm12 md5>
      <item-maker v-model="item"></item-maker>
    </v-flex>
  </v-layout>
</template>

<script>
import { ItemGrid } from "../../lib/item/ItemGrid";
import { sql, request } from "../../lib/sql";
import {
  getWarehouse,
  createWarehouse,
  clearWarehouse,
  repairWarehouse,
  setWarehouseMoney,
  setExpandedWarehouseState,
} from "../../lib/warehouse";
import ItemsGrid from "./ItemsGrid";
import ItemMaker from "../ItemMaker/ItemMaker";

export default {
  name: "warehouse-page",

  components: {
    ItemsGrid,
    ItemMaker,
  },

  data() {
    return {
      account: "",
      warehouseItems: [],
      money: 0,
      isWarehouseAvailable: false,
      isWarehouseExpanded: false,
      columns: {
        items: {
          length: 0,
        },
      },
      item: {
        group: 0,
        id: 0,
        level: 0,
        option: 0,
        luck: false,
        skill: false,
        refinery: false,
        durability: 0,
        ancient: {
          set: 0,
          level: 0,
        },
        serial: {
          type: 0,
          value1: 0,
          value2: 0,
        },
        excellent: [],
        sockets: [255, 255, 255, 255, 255],
        harmony: {
          option: 0,
          level: 0,
        },
      },
    };
  },

  methods: {
    async reload() {
      await this.loadWarehouse();
    },

    async repair() {
      try {
        if (confirm("This action possibly can damage items in warehouse!")) {
          await repairWarehouse(this.account);
          await this.reload();
        }
      } catch (err) {
        this.$msg.error(err.message);
      }
    },

    async clear() {
      try {
        if (confirm("This action will delete all items in warehouse!")) {
          await clearWarehouse(this.account);
          await this.reload();
        }
      } catch (err) {
        this.$msg.error(err.message);
      }
    },

    async create() {
      try {
        await createWarehouse(this.account);
        await this.reload();
        this.$msg.success("Warehouse created successfully");
      } catch (err) {
        this.$msg.error(err.message);
      }
    },

    async loadWarehouse() {
      try {
        const response = await getWarehouse(this.account);

        this.columns.items.length = response.recordset.columns.items.length;
        if (response.recordset[0].items) {
          this.warehouseItems = Array.from(response.recordset[0].items);
        }
        this.isWarehouseExpanded = response.recordset[0].expanded === 1;
        this.money = response.recordset[0].money;
        this.isWarehouseAvailable = true;
      } catch (err) {
        this.$msg.error(err.message);
        this.isWarehouseAvailable = false;
        this.isWarehouseExpanded = false;
        this.warehouseItems = [];
        this.money = 0;
      }
    },

    async saveMoney() {
      try {
        await setWarehouseMoney(this.account, this.money);
      } catch (err) {
        this.$msg.error(err.message);
      }
    },

    async lockExpandedWarehouse() {
      try {
        if (confirm("You can lose all items in extpanded inventory!")) {
          const response = await setExpandedWarehouseState(this.account, 0);

          if (response.rowsAffected.length > 0) {
            this.isWarehouseExpanded = false;
          }
        }
      } catch (err) {
        this.$msg.error(err.message);
      }
    },

    async unlockExpandedWarehouse() {
      try {
        const response = await setExpandedWarehouseState(this.account, 1);

        if (response.rowsAffected.length > 0) {
          this.isWarehouseExpanded = true;
        }
      } catch (err) {
        this.$msg.error(err.message);
      }
    },

    async onItemDeleted() {
      await this.reload();
    },

    async onItemAdded() {
      await this.reload();
    },
  },

  async beforeMount() {
    this.account = this.$route.params.account;

    if (!this.account) {
      this.account = localStorage.getItem("lastAccount");
    } else {
      localStorage.setItem("lastAccount", this.account);
    }

    await this.loadWarehouse();
  },
};
</script>

<style lang="scss">
.account-warehouse-page {
  max-width: 530px !important;
  // flex: 0 0 530px !important;
}

.item-maker-container {
  @media (min-width: 960px) {
    flex: 1 0 auto !important;
    max-width: 430px !important;
  }
}

.warehouse-container {
  margin: 6px 8px;
}

.warehouse-controls {
  margin: 10px 0 0 0;
}

.v-btn {
  .build-icon {
    transform: scale(0.8);
  }
}

.v-subheader {
  span {
    margin: 0 5px;
  }
}
</style>
