function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
}

function info(data) {
  const str = `%c  \uD83D\uDEC8 ${data}`;
  const color = `color: #35B9AE`;
  console.log(str, color);
}

class Server {
  constructor({ user, password, server, port, database } = {}) {
    this.id = uuid();
    this.user = user || "sa";
    this.password = password || "123456";
    this.server = server || "127.0.0.1";
    this.port = port || 1433;
    this.database = database || "MuOnline";
    this.pool = {
      max: 10,
      min: 0,
      idleTimeoutMillis: 5000,
    };
    this.name = `${this.database}@${this.server}:${this.port}`;
  }

  static from(data = {}) {
    const server = new Server(data);
    if (data.id) {
      server.id = data.id;
    }
    return server;
  }
}

const state = {
  servers: [],
  currentServer: null,
};

try {
  const setupConfig = localStorage.getItem("setupConfig");
  const { servers, currentServer } = JSON.parse(setupConfig);
  state.servers = servers.map(server => Server.from(server));
  state.currentServer = currentServer;
} catch (err) {
  info("Loading default configuration");
  state.servers = [
    new Server({
      port: 1433,
      database: `MuOnline`,
      user: "profesor08",
      password: "123456",
    }),
    new Server({
      port: Math.floor(Math.random() * 65535),
      database: `MuOnline_` + Math.floor(Math.random() * 500),
    }),
    new Server({
      port: Math.floor(Math.random() * 65535),
      database: `MuOnline_` + Math.floor(Math.random() * 500),
    }),
    new Server({
      port: Math.floor(Math.random() * 65535),
      database: `MuOnline_` + Math.floor(Math.random() * 500),
    }),
    new Server({
      port: Math.floor(Math.random() * 65535),
      database: `MuOnline_` + Math.floor(Math.random() * 500),
    }),
    new Server({
      port: Math.floor(Math.random() * 65535),
      database: `MuOnline_` + Math.floor(Math.random() * 500),
    }),
    new Server({
      port: Math.floor(Math.random() * 65535),
      database: `MuOnline_` + Math.floor(Math.random() * 500),
    }),
    new Server({
      port: Math.floor(Math.random() * 65535),
      database: `MuOnline_` + Math.floor(Math.random() * 500),
    }),
  ];
  state.currentServer = state.servers[0];
}

function saveSetupConfig() {
  return;
  try {
    localStorage.setItem(
      "setupConfig",
      JSON.stringify({
        servers: Array.from(state.servers),
        currentServer: state.currentServer,
      }),
    );
  } catch (err) {
    console.warn("Setup Config not saved");
    console.warn(err);
  }
}

const mutations = {
  setCurrentServer(state, { server }) {
    if (server) {
      state.currentServer = server;
      saveSetupConfig();
    }
  },

  updateServer(state, { server }) {
    if (server) {
      state.servers = state.servers.map(prevServer => {
        if (prevServer.id === server.id) {
          return server;
        }
        return prevServer;
      });
      state.currentServer = server;
      saveSetupConfig();
    }
  },

  addServer(state, { server, callback }) {
    if (server) {
      const servers = state.servers;
      const newServer = new Server(server);
      servers.push(newServer);
      state.servers = servers;
      state.currentServer = newServer;

      if (callback) {
        callback();
      }

      saveSetupConfig();
    }
  },

  deleteServer(state, { server }) {
    if (server) {
      // console.log(server.id);

      const servers = state.servers;
      for (let i = 0; i < servers.length; i++) {
        if (servers[i].id === server.id) {
          servers.splice(i, 1);
          state.servers = servers;

          if (servers[i]) {
            state.currentServer = servers[i];
          } else if (servers.length > 0) {
            state.currentServer = servers[servers.length - 1];
          } else {
            const server = new Server();
            state.servers = [server];
            state.currentServer = server;
          }

          break;
        }
      }

      // console.log(state.currentServer.id);
      saveSetupConfig();
    }
  },
};

const actions = {
  setCurrentServer({ commit }, data) {
    commit("setCurrentServer", data);
  },

  updateServer({ commit }, data) {
    commit("updateServer", data);
  },

  addServer({ commit }, data) {
    commit("addServer", data);
  },

  deleteServer({ commit }, data) {
    commit("deleteServer", data);
  },
};

export default {
  state,
  mutations,
  actions,
};
