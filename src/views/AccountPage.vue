<template>
  <div v-if="pageIsLoaded" class="container account__container">
    <div class="account__head">
      <div class="account__top">
        <h1 class="heading-reset account__heading">Просмотр счёта</h1>
        <router-link
          :to="{ name: 'accounts' }"
          class="btn btn-primary account__back"
        >
          <svg
            class="arrow"
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.83 5L7.41 1.41L6 0L0 6L6 12L7.41 10.59L3.83 7L16 7V5L3.83 5Z"
              fill="white"
            />
          </svg>
          Вернуться назад
        </router-link>
      </div>
      <div class="account__bottom">
        <div class="account__number">№ {{ accountNumber }}</div>
        <div class="account__balance">
          <span>Баланс</span> {{ this.accountData.balance }} ₽
        </div>
      </div>
    </div>
    <div class="account__content">
      <form
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
          />
          <span class="error-local" v-if="formError.to">
            {{ formError.to }}
          </span>
        </label>
        <label for="summa" class="transaction-form__label">
          Сумма перевода
          <input
            class="input-reset transaction-form__input"
            type="text"
            id="summa"
            placeholder="Сумма"
            v-model="formData.amount"
            @input="inputHandle"
          />
          <span class="error-local" v-if="formError.amount">
            {{ formError.amount }}
          </span>
        </label>
        <div class="error-local error-global" v-if="transferFailed">
          Не удалось выполнить перевод
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
    </div>
  </div>
  <base-spinner v-if="pageLoading" />
  <load-error v-if="loadingFailed" :callback="loadAccountData" />
</template>

<script>
import BaseSpinner from "@/components/BaseSpinner";
import LoadError from "@/components/LoadError";
import axios from "axios";
import { BASE_URL } from "@/api/api.config";

export default {
  name: "AccountPage",
  components: { BaseSpinner, LoadError },

  data() {
    return {
      accountNumber: this.$route.params.account,
      formData: {
        from: this.$route.params.account,
      },
      formError: {},
      accountData: null,
      pageLoading: true,
      pageIsLoaded: false,
      loadingFailed: false,
      transferFailed: false,
      transferInProcess: false,
    };
  },

  methods: {
    loadAccountData() {
      this.pageLoading = true;
      this.loadingFailed = false;

      axios
        .get(`${BASE_URL}/account/${this.accountNumber}`, {
          headers: {
            Authorization: `Basic ${this.$store.state.authToken}`,
          },
        })
        .then((res) => {
          if (!res.data.payload) {
            this.pageLoading = false;
            this.loadingFailed = true;
            return;
          }

          this.accountData = res.data.payload;
          this.pageLoading = false;
          this.pageIsLoaded = true;
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

          this.formData = {};
          this.transferInProcess = false;
          this.accountData = res.data.payload;
        })
        .catch(() => {
          this.transferFailed = true;
        });
    },

    inputHandle(e) {
      const value = e.target.value;
      e.target.value = value.replace(/[a-z]/gi, "");
    },
  },

  created() {
    if (!this.$store.state.authToken) {
      this.$router.push({ name: "auth" });
    }

    this.loadAccountData();
  },
};
</script>

<style lang="scss" scoped>
.account {
  &__heading {
    font-size: 34px;
    line-height: 40px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--black);
  }

  &__head {
    padding-top: 50px;
    padding-bottom: 50px;
    display: flex;
    flex-direction: column;
  }

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__number {
    font-size: 34px;
    line-height: 40px;
    font-weight: 400;
    letter-spacing: -0.02em;
  }

  &__balance {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    line-height: 23px;
    letter-spacing: -0.02em;

    & span {
      margin-right: 50px;
      font-weight: 700;
    }
  }

  &__back {
    & svg {
      margin-right: 14px;
    }
  }
}

.transaction-form {
  display: flex;
  flex-direction: column;
  max-width: 606px;
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
</style>
