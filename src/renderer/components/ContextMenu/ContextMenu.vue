<template>
  <div class="context-menu" ref="menu" v-bind:class="className" v-bind:style="style">
    <context-menu-item v-if="isTextSelected" v-on:click="copySelection">Copy</context-menu-item>
    <context-menu-separator v-if="isTextSelected"></context-menu-separator>

    <context-menu-item v-if="isItem" @click="copyItemInfo">
      <v-icon color="blue-grey darken-3">mdi mdi-content-copy</v-icon>Copy Item Info
    </context-menu-item>
    <context-menu-separator v-if="isItem"></context-menu-separator>

    <context-menu-item v-if="isItem" @click="copyItemBytes">
      <v-icon color="blue-grey darken-3">mdi mdi-code-brackets</v-icon>Copy Item Bytes
    </context-menu-item>
    <context-menu-separator v-if="isItem"></context-menu-separator>

    <context-menu-item v-if="isItem" @click="deleteItem">
      <v-icon color="blue-grey darken-3">mdi mdi-delete-forever-outline</v-icon>Delete Item
    </context-menu-item>
    <context-menu-separator v-if="isItem"></context-menu-separator>

    <context-menu-item v-if="isImage" @click="downloadImage">
      <v-icon color="blue-grey darken-3">mdi mdi-content-save-edit-outline</v-icon>Save Image
    </context-menu-item>
    <context-menu-separator v-if="isImage"></context-menu-separator>

    <context-menu-item v-if="isFile" @click="revealInExplorer">
      <v-icon color="blue-grey darken-3">mdi mdi-folder-open-outline</v-icon>Reveal in Explorer
    </context-menu-item>
    <context-menu-separator v-if="isFile"></context-menu-separator>

    <context-menu-item v-on:click="inspectElement">
      <v-icon color="blue-grey darken-3">mdi mdi-table-search</v-icon>Inspect Element
    </context-menu-item>
  </div>
</template>

<script>
import ContextMenuItem from "./ContextMenuItem.vue";
import ContextMenuSeparator from "./ContextMenuSeparator.vue";
import { TimelineMax } from "gsap";
import fs from "fs";
import { deleteWarehouseItem } from "../../lib/warehouse";

export default {
  name: "context-menu",

  components: { ContextMenuItem, ContextMenuSeparator },

  data() {
    return {
      isActive: false,
      x: 0,
      y: -99999,
      offset: 20,
      mouse: {
        x: 0,
        y: -99999,
      },
      selectedText: "",
      target: null,
      itemTarget: null,
    };
  },

  computed: {
    style() {
      if (this.isActive === true) {
        return {
          top: this.y + "px",
          left: this.x + "px",
        };
      } else {
        return {
          left: "-99999px",
        };
      }
    },

    className() {
      if (this.isActive === true) {
        return "is-active";
      }

      return "";
    },

    isItem() {
      let target = this.target;

      while (target && target instanceof HTMLElement) {
        if (target.getAttribute(`data-type`) === `mu-item`) {
          this.itemTarget = target;
          return true;
        } else {
          target = target.parentNode;
        }
      }

      return false;
    },

    isImage() {
      return this.target instanceof HTMLImageElement;
    },

    isTextSelected() {
      return this.selectedText.length > 0;
    },
  },

  asyncComputed: {
    isFile() {
      return new Promise(resolve => {
        if (this.isImage) {
          fs.stat(this.target.src, (err, stats) => {
            if (!err) {
              resolve(stats.isFile() || stats.isDirectory());
            } else {
              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      });
    },
  },

  methods: {
    close(event) {
      document.body.removeEventListener("click", this.close);
      this.isActive = false;
    },

    open(x, y) {
      const menu = this.$refs.menu;

      if (x + menu.offsetWidth + this.offset > window.innerWidth) {
        x -= menu.offsetWidth + this.offset;
      }

      if (y + menu.offsetHeight + this.offset > window.innerHeight) {
        y -= menu.offsetHeight + this.offset;
      }

      this.x = x;
      this.y = y;

      new TimelineMax().fromTo(
        menu,
        0.2,
        {
          opacity: 0,
          y: -10,
        },
        {
          opacity: 1,
          y: 0,
        },
      );
    },

    inspectElement() {
      const win = this.$electron.remote.BrowserWindow.getFocusedWindow();

      if (win) {
        win.inspectElement(this.mouse.x, this.mouse.y);
      }
    },

    getSelectionText() {
      var text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
      }
      return text;
    },

    copyToClipboard(text) {
      const clipboard = this.$electron.remote.clipboard;

      clipboard.writeText(text);
    },

    copySelection() {
      this.copyToClipboard(this.selectedText);
    },

    copyItemInfo() {
      if (this.itemTarget && this.itemTarget.item) {
        const pre = document.createElement("pre");
        pre.innerHTML = this.itemTarget.item.getInfo();

        function getText(elem) {
          const lines = [];

          function getLine(elem) {
            Array.from(elem.childNodes).forEach(node => {
              if (node instanceof Text) {
                lines.push(node.textContent);
              } else {
                getLine(node);
              }
            });
          }

          getLine(elem);

          return lines.join(`\n`);
        }

        this.copyToClipboard(getText(pre));
      }
    },

    copyItemBytes() {
      if (this.itemTarget && this.itemTarget.item) {
        this.copyToClipboard(this.itemTarget.item.bytes.join(", "));
      }
    },

    async deleteItem() {
      if (this.itemTarget && this.itemTarget.item) {
        try {
          const offset = parseInt(this.itemTarget.getAttribute("data-offset"));

          if (this.itemTarget.storage === "warehouse") {
            await this.itemTarget.onBeforeItemDeleting();
            await deleteWarehouseItem(this.itemTarget.account, offset);
            await this.itemTarget.onItemDeleted();
          }
        } catch (err) {
          this.$msg.error(err.message);
        }
      }
    },

    downloadImage() {
      if (this.isImage) {
        this.$electron.ipcRenderer.send("download-start", {
          url: this.target.src,
        });
      }
    },

    revealInExplorer() {
      if (this.isImage) {
        try {
          this.$electron.shell.showItemInFolder(this.target.src);
        } catch (err) {
          console.warn(err);
        }
      }
    },
  },

  mounted() {
    this.$refs.menu.addEventListener("click", e => {
      e.preventDefault();
    });

    document.body.addEventListener("contextmenu", event => {
      this.isActive = true;
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
      this.selectedText = this.getSelectionText();
      this.target = event.target;
      this.open(event.clientX, event.clientY);

      document.body.addEventListener("click", this.close);
    });
  },
};
</script>

<style lang="scss">
.context-menu {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: -99999px;
  background: #ffffff;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
}
</style>
