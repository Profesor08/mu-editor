const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const electronLocalshortcut = require("electron-localshortcut");

import { autoUpdater } from "electron-updater";
import { download } from "electron-dl";

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

electron.ipcMain.on("download-start", (event, { url }) => {
  const win = BrowserWindow.getFocusedWindow();

  download(win, url, {
    saveAs: true,
  });
});

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 1050,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    require("vue-devtools").install();
  }

  mainWindow.loadURL(winURL);

  mainWindow.setMenu(null);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  electronLocalshortcut.register(mainWindow, "F12", () => {
    mainWindow.webContents.toggleDevTools();
  });

  electronLocalshortcut.register(mainWindow, "F5", () => {
    mainWindow.reload();
  });
}

electron.app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("ready", () => {
  if (process.env.NODE_ENV === "production") autoUpdater.checkForUpdates();
});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});
