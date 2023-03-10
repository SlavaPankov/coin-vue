import { createStore } from "vuex";
import axios from "axios";
import { BASE_URL } from "@/api/api.config";

export default createStore({
  state: {
    accountData: null,
    authToken: "",
    autofillList: [],
    currentAccountBalance: 0,
    accountNumber: 0,
    currenciesData: [],
  },
  getters: {
    getAccountData(state) {
      return state.accountData;
    },
    getTransactions(state) {
      return state.accountData.transactions.reverse();
    },
    getAccountNumber(state) {
      return state.accountNumber;
    },
    getBalance(state) {
      return state.accountData.balance;
    },
    getAllCurrencies(state) {
      return state.currenciesData;
    },
  },
  mutations: {
    updateAccountData(state, value) {
      state.accountData = value;
    },
    updateAuthToken(state, token) {
      state.authToken = token;
    },
    updateAutofillList(state, value) {
      state.autofillList.push(value);
    },
    updateCurrentAccountBalance(state, value) {
      state.currentAccountBalance = value;
    },
    updateAccountNumber(state, value) {
      state.accountNumber = value;
    },
    updateCurrenciesData(state, value) {
      state.currenciesData = value;
    },
  },
  actions: {
    loadAccountData(context) {
      return axios
        .get(`${BASE_URL}/account/${context.state.accountNumber}`, {
          headers: {
            Authorization: `Basic ${context.state.authToken}`,
          },
        })
        .then((res) => {
          context.commit("updateAccountData", res.data.payload);
          return res.data.payload;
        });
    },
    loadCurrenciesData(context) {
      return axios.get(`${BASE_URL}/all-currencies`).then((res) => {
        context.commit("updateCurrenciesData", res.data.payload);
        return res.data.payload;
      });
    },
  },
  modules: {},
});
