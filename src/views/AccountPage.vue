<template>
  <div v-if="pageIsLoaded" class="container account__container">
    <account-head :account-number="accountNumber" :balance="balance" />
    <div class="account__content">
      <form
        autocomplete="off"
        method="post"
        class="account__transaction transaction-form"
        @submit.prevent="transferFounds"
      >
        <h2 class="heading-reset transaction-form__heading">Новый перевод</h2>
        <label for="number" class="transaction-form__label">
          Номер счёта получателя
          <input
            class="input-reset transaction-form__input"
            type="text"
            id="number"
            placeholder="Номер счёта"
            v-model="formData.to"
            @input="inputHandle"
            list="autofill"
          />
          <span
            class="transaction-form__block"
            v-if="this.$store.state.autofillList.length > 0"
          >
            <datalist id="autofill">
              <option
                v-for="(account, index) in this.$store.state.autofillList"
                :key="index"
                :value="account"
              />
            </datalist>
          </span>
          <span class="error-local" v-if="formError.to">
            {{ formError.to }}
          </span>
        </label>
        <label for="amount" class="transaction-form__label">
          Сумма перевода
          <input
            class="input-reset transaction-form__input"
            type="text"
            id="amount"
            placeholder="Сумма"
            v-model="formData.amount"
            @input="inputHandle"
          />
          <span class="error-local" v-if="formError.amount">
            {{ formError.amount }}
          </span>
        </label>
        <div
          class="error-local error-global"
          :class="{ success: !transferFailed }"
          v-if="transferFailed || transferDone"
        >
          {{
            transferFailed
              ? "Не удалось выполнить перевод"
              : "Перевод выполнен успешно"
          }}
        </div>
        <button
          :disabled="transferInProcess"
          type="submit"
          class="btn btn-primary transaction-form__button"
        >
          <svg
            width="20"
            height="16"
            viewBox="0 0 20 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 16H2C0.89543 16 0 15.1046 0 14V1.913C0.0466084 0.842547 0.928533 -0.00101428 2 -9.95438e-07H18C19.1046 -9.95438e-07 20 0.89543 20 2V14C20 15.1046 19.1046 16 18 16ZM2 3.868V14H18V3.868L10 9.2L2 3.868ZM2.8 2L10 6.8L17.2 2H2.8Z"
              fill="white"
            />
          </svg>
          Отправить
        </button>
      </form>
      <router-link :to="{ name: 'accountDetail' }" class="account__chart">
        <base-bar
          :current-account="accountNumber"
          :config="accountData.transactions"
          month-count="5"
        />
      </router-link>
      <router-link :to="{ name: 'accountDetail' }" class="account__history">
        <transaction-history
          :line-count="10"
          :transactions-data="accountData.transactions"
          :account-number="accountNumber"
        />
      </router-link>
    </div>
  </div>
  <base-spinner v-if="pageLoading" />
  <load-error v-if="loadingFailed" :callback="loadAccountData" />
</template>

<script>
import TransactionHistory from "@/components/TransactionHistory";
import AccountHead from "@/components/AccountHead";
import BaseSpinner from "@/components/BaseSpinner";
import LoadError from "@/components/LoadError";
import BaseBar from "@/components/BaseBar";
import axios from "axios";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { BASE_URL } from "@/api/api.config";

export default {
  name: "AccountPage",
  components: {
    AccountHead,
    BaseBar,
    BaseSpinner,
    LoadError,
    TransactionHistory,
  },

  data() {
    return {
      formData: {
        from: this.$route.params.account,
      },
      formError: {},
      pageLoading: true,
      pageIsLoaded: false,
      loadingFailed: false,
      transferFailed: false,
      transferInProcess: false,
      transferDone: false,
      focused: false,
    };
  },

  methods: {
    ...mapMutations({
      updateAutofillList: "updateAutofillList",
      updateCurrentAccountBalance: "updateCurrentAccountBalance",
      updateAccountNumber: "updateAccountNumber",
    }),
    ...mapActions({ loadAccountDataFromStore: "loadAccountData" }),

    loadAccountData() {
      this.pageLoading = true;
      this.loadingFailed = false;

      this.loadAccountDataFromStore()
        .then((res) => {
          if (!res) {
            this.pageLoading = false;
            this.loadingFailed = true;
            return;
          }

          this.pageLoading = false;
          this.pageIsLoaded = true;
          this.updateCurrentAccountBalance(this.accountData.balance);
        })
        .catch(() => {
          this.pageLoading = false;
          this.loadingFailed = true;
        });
    },

    transferFounds() {
      this.formError = {};
      this.transferInProcess = true;

      if (!this.formData.to) {
        this.formError.to = "Укажите счет получателя";
      }

      if (!this.formData.amount) {
        this.formError.amount = "Укажите сумму перевода";
      }

      if (this.formData.to === this.accountNumber) {
        this.formError.to = "Этот счет принадлежит вам";
      }

      if (this.formData.amount > this.accountData.balance) {
        this.formError.amount = "Недостаточно средств";
      }

      if (Object.keys(this.formError).length !== 0) {
        this.transferInProcess = false;

        return;
      }

      axios
        .post(
          `${BASE_URL}/transfer-funds`,
          {
            ...this.formData,
          },
          {
            headers: {
              Authorization: `Basic ${this.$store.state.authToken}`,
            },
          }
        )
        .then((res) => {
          if (!res.data.payload) {
            this.transferFailed = true;
            this.transferInProcess = false;
            return;
          }
          const list = JSON.parse(localStorage.getItem("autofillList"));
          if (list && list.length > 0) {
            let isset = false;

            for (let i = 0; i < list.length; i++) {
              if (list[i] === this.formData.to) {
                isset = true;
                break;
              }
            }

            if (!isset) {
              list.push(this.formData.to);
              localStorage.setItem("autofillList", JSON.stringify(list));
              this.updateAutofillList(this.formData.to);
            }
          } else {
            const autofillList = [];
            autofillList.push(this.formData.to);
            localStorage.setItem("autofillList", JSON.stringify(autofillList));
            this.updateAutofillList(this.formData.to);
          }

          this.formData.to = null;
          this.formData.amount = null;
          this.transferInProcess = false;
          this.transferDone = true;
          this.accountData = res.data.payload;

          setTimeout(() => {
            this.transferDone = false;
          }, 3000);
        })
        .catch(() => {
          this.transferInProcess = false;
          this.transferFailed = true;
        });
    },

    inputHandle(e) {
      const value = e.target.value;
      e.target.value = value.replace(/[a-z]/gi, "");
      console.log(typeof this.accountNumber);
    },
  },

  computed: {
    ...mapGetters({
      accountData: "getAccountData",
      accountNumber: "getAccountNumber",
      balance: "getBalance",
    }),
  },

  created() {
    this.updateAccountNumber(this.$route.params.account);
    this.loadAccountData();
  },
};
</script>

<style lang="scss" scoped>
.account {
  &__container {
    padding-bottom: 50px;
  }

  &__content {
    display: flex;
    flex-wrap: wrap;
    row-gap: 50px;
  }

  &__chart {
    max-width: 684px;
    width: 100%;
  }

  &__history {
    width: 100%;
  }
}

.transaction-form {
  display: flex;
  flex-direction: column;
  max-width: 606px;
  width: 100%;
  margin-right: 50px;
  padding: 25px 50px;
  background-color: var(--gray-7);
  border-radius: 50px;

  &__heading {
    margin-bottom: 25px;
    font-size: 20px;
    line-height: 23px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  &__label {
    margin-bottom: 25px;
    font-family: "Ubuntu", "Work Sans", sans-serif;
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    text-align: right;
    letter-spacing: -0.01em;
  }

  &__input {
    max-width: 300px;
    width: 100%;
    margin-left: 13px;
    padding: 10px 16px;
    border: 1px solid var(--gray-5);
    border-radius: 7px;
    font-family: "Ubuntu", "Work Sans", sans-serif;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.01em;
    background-color: var(--white);
    color: var(--black);

    &::placeholder {
      color: var(--gray-4);
    }
  }

  &__button {
    display: flex;
    align-items: center;
    margin-left: 205px;

    & svg {
      margin-right: 12px;
    }
  }

  &__block {
    position: relative;
    display: block;
  }
}

.error-local {
  display: block;
  font-size: 14px;
  font-weight: 400;
  color: var(--error);
}

.error-global {
  text-align: center;
  margin-bottom: 15px;
}

.success {
  color: var(--success);
}
</style>
