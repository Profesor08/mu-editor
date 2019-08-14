const state = {
  initialized: false,
};

const mutations = {
  initialize(state) {
    state.initialized = true;
  },
};

const actions = {
  initialize({ commit }) {
    commit("initialize");
  },
};

export default {
  state,
  mutations,
  actions,
};
