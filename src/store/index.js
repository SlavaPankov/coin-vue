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
    updateAutofillList(state, value) {
      state.autofillList.push(value);
    },
  },
  actions: {},
  modules: {},
});
