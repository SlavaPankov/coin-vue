import { createStore } from "vuex";

export default createStore({
  state: {
    authToken: "",
    autofillList: [],
  },
  getters: {},
  mutations: {
    updateAuthToken(state, token) {
      state.authToken = token;
    },
  },
  actions: {},
  modules: {},
});
