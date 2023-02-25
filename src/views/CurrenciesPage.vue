<template>
  <div v-if="pageIsLoaded" class="container currencies__container">
    <h1 class="heading-reset currencies__heading">Валютный обмен</h1>
    <div class="currencies__content">
      <div class="currencies__left">
        <div class="currencies__own">
          <h2 class="heading-reset currencies__own-heading">Ваши валюты</h2>
          <ul class="list-reset currencies__list">
            <li
              class="currencies__item"
              v-for="currency in ownCurrenciesData"
              :key="currency.code"
            >
              <span class="currencies__code">{{ currency.code }}</span>
              <span class="currencies__value">{{ currency.amount }}</span>
            </li>
          </ul>
        </div>
        <form
          class="currencies__buy buy"
          autocomplete="off"
          @submit.prevent="transferFounds"
        >
          <h2 class="heading-reset buy__heading">Обмен валюты</h2>
          <div class="buy__body">
            <div class="buy__left">
              <div class="buy__left-top">
                <div class="buy__label" @click.stop>
                  <span class="buy__label-text">Из</span>
                  <span class="buy__wrapper">
                    <input
                      @click="
                        fromListOpen = true;
                        toListOpen = false;
                      "
                      v-model="formData.from"
                      type="text"
                      id="from"
                      class="buy__input input-reset"
                    />
                    <span
                      class="list-reset dropdown"
                      :class="{ open: fromListOpen }"
                    >
                      <span
                        class="dropdown__item"
                        data-target="own"
                        @click="selectCurrency"
                        v-for="currency in Object.entries(ownCurrenciesData)"
                        :key="currency[1].code"
                      >
                        {{ currency[1].code }}
                      </span>
                    </span>
                  </span>
                  <svg
                    class="buy__arrow"
                    :class="{ rotate: fromListOpen }"
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0.5L5 5.5L10 0.5H0Z" fill="#182233" />
                  </svg>
                </div>
                <div class="buy__label" @click.stop>
                  <span class="buy__label-text">в</span>
                  <span class="buy__wrapper">
                    <input
                      @click="
                        toListOpen = true;
                        fromListOpen = false;
                      "
                      v-model="formData.to"
                      type="text"
                      id="from"
                      class="buy__input input-reset"
                    />
                    <span
                      class="list-reset dropdown"
                      :class="{ open: toListOpen }"
                    >
                      <span
                        class="dropdown__item"
                        data-target="all"
                        @click="selectCurrency"
                        v-for="currency in allCurrencies"
                        :key="currency"
                      >
                        {{ currency }}
                      </span>
                    </span>
                  </span>
                  <svg
                    class="buy__arrow"
                    :class="{ rotate: toListOpen }"
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0.5L5 5.5L10 0.5H0Z" fill="#182233" />
                  </svg>
                </div>
              </div>
              <div class="buy__left-bottom">
                <label for="amount" class="buy__label buy__label--amount">
                  <span class="buy__label-text">Сумма</span>
                  <input
                    v-model="formData.amount"
                    type="text"
                    id="amount"
                    class="buy__input buy__input--amount input-reset"
                  />
                </label>
              </div>
            </div>
            <div class="buy__right">
              <button type="submit" class="btn btn-primary buy__button">
                Обменять
              </button>
            </div>
          </div>
          <div
            v-if="transferFailed || transferSuccess"
            :class="{ error: transferFailed, success: transferSuccess }"
            class="message"
          >
            {{ transferMessage }}
          </div>
        </form>
      </div>
      <div class="currencies__right">
        <h2 class="heading-reset buy__heading">
          Изменение курсов в реальном времени
        </h2>
        <ul class="list-reset feed-list">
          <li class="feed-list__item">
            <div class="feed-list__currencies">BTC/ETH</div>
            <div class="feed-list__change">
              <div class="feed-list__amount">6.3123545131</div>
              <svg
                width="20"
                height="10"
                viewBox="0 0 20 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0L10 10L20 0H0Z" fill="#000000" />
              </svg>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <base-spinner v-if="pageLoading" />
  <load-error v-if="loadFailed" :callback="loadCurrenciesData" />
</template>

<script>
import BaseSpinner from "@/components/BaseSpinner";
import LoadError from "@/components/LoadError";
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import { BASE_URL } from "@/api/api.config";

export default {
  name: "CurrenciesPage",
  components: { BaseSpinner, LoadError },
  data() {
    return {
      ownCurrenciesData: {},
      currencyFeed: {},
      formData: {},
      formError: {},
      fromListOpen: false,
      toListOpen: false,
      pageLoading: true,
      pageIsLoaded: false,
      loadFailed: false,
      transferInProcess: false,
      transferFailed: false,
      transferSuccess: false,
      transferMessage: "",
    };
  },

  methods: {
    ...mapActions(["loadCurrenciesData"]),

    getOwnCurrencies() {
      axios
        .get(`${BASE_URL}/currencies`, {
          headers: {
            Authorization: `Basic ${this.$store.state.authToken}`,
          },
        })
        .then((res) => {
          if (!res.data.payload) {
            this.pageLoading = false;
            this.loadFailed = true;
            return;
          }

          this.ownCurrenciesData = res.data.payload;
          this.formData.from = Object.entries(res.data.payload)[0][1].code;
          this.pageLoading = false;
          this.pageIsLoaded = true;
        })
        .catch(() => {
          this.pageLoading = false;
          this.loadFailed = true;
        });
    },

    selectCurrency(evt) {
      switch (evt.target.dataset.target) {
        case "own":
          this.formData.from = evt.target.textContent.trim();
          this.fromListOpen = false;
          break;
        case "all":
          this.formData.to = evt.target.textContent.trim();
          this.toListOpen = false;
          break;
      }
    },

    close(evt) {
      if (evt.target !== document.querySelector(".buy__label")) {
        this.fromListOpen = false;
        this.toListOpen = false;
      }
    },

    parseTransferError(response) {
      switch (response.error) {
        case "Unknown currency code":
          this.transferMessage = "Передан неверный валютный код";
          break;
        case "Invalid amount":
          this.transferMessage =
            "Не указана сумма перевода, или она отрицательная";
          break;
        case "Not enough currency":
          this.transferMessage = "На валютном счёте списания нет средств";
          break;
        case "Overdraft prevented":
          this.transferMessage = "Не достаточно средств для перевода";
          break;
      }
    },

    transferFounds() {
      this.transferInProcess = true;

      axios
        .post(
          `${BASE_URL}/currency-buy`,
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
            this.transferInProcess = false;
            this.transferFailed = true;
            this.parseTransferError(res.data);
            return;
          }

          this.ownCurrenciesData = res.data.payload;
          this.transferInProcess = false;
          this.transferSuccess = true;
          this.transferMessage = "Покупка выполнена";

          setTimeout(() => {
            this.transferSuccess = false;
            this.transferMessage = "";
          }, 3000);
        });
    },
  },

  mounted() {
    document.addEventListener("click", this.close);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.close);
  },

  computed: {
    ...mapGetters({ allCurrencies: "getAllCurrencies" }),
  },

  created() {
    this.getOwnCurrencies();
    this.loadCurrenciesData().then((res) => (this.formData.to = res[0]));
  },
};
</script>

<style lang="scss" scoped>
.currencies {
  &__container {
    padding-top: 50px;
    padding-bottom: 50px;
  }

  &__heading {
    margin-bottom: 56px;
    font-size: 34px;
    line-height: 40px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--black);
  }

  &__content {
    display: flex;
    align-items: flex-start;
    gap: 50px;
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: 44px;
    flex-basis: 50%;
  }

  &__right {
    padding: 50px;
    background: var(--gray-8);
    border-radius: 50px;
    max-width: 708px;
    width: 100%;
    max-height: 100%;
  }

  &__own {
    max-width: 588px;
    width: 100%;
    padding: 50px;
    border-radius: 50px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
    background: var(--white);

    &-heading {
      margin-bottom: 25px;
      font-size: 20px;
      line-height: 23px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 25px;
    }

    &::after {
      content: "";
      position: absolute;
      width: 100%;
      top: 75%;
      left: 0;
      border-bottom: 1px dashed var(--black);
      z-index: 1;
    }
  }

  &__code,
  &__value {
    font-weight: 600;
    font-size: 20px;
    line-height: 23px;
    letter-spacing: 0.1em;
    background-color: var(--white);
    z-index: 2;
  }

  &__value {
    font-weight: 400;
  }
}

.buy {
  max-width: 588px;
  width: 100%;
  padding: 50px;
  border-radius: 50px;
  background: var(--white);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);

  &__body {
    display: flex;
    align-items: stretch;
    gap: 25px;
  }

  &__wrapper {
    position: relative;
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: 25px;

    &-top {
      display: flex;
    }
  }

  &__heading {
    margin-bottom: 25px;
    font-weight: 700;
    font-size: 20px;
    line-height: 23px;
    letter-spacing: -0.02em;
  }

  &__label {
    position: relative;
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-right: 20px;
    }

    &-text {
      margin-right: 20px;
      font-family: "Ubuntu", "Work Sans", sans-serif;
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
      letter-spacing: -0.01em;
    }

    &--amount {
      margin-right: 0;
      &-text {
        margin-right: 8px;
      }
    }
  }

  &__input {
    max-width: 134px;
    width: 100%;
    padding: 10px 15px;
    background-color: var(--white);
    border: 1px solid var(--gray-5);
    border-radius: 7px;
    font-family: "Ubuntu", "Work Sans", sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.01em;

    &--amount {
      max-width: 100%;
    }
  }

  &__arrow {
    position: absolute;
    top: 50%;
    right: 19.5px;
    transform: translateY(-50%);
    transition: transform 0.3s ease-in-out;
  }

  &__button {
    height: 100%;
  }
}

.dropdown {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  right: 0;
  max-width: 134px;
  width: 100%;
  background-color: var(--white);
  z-index: 2;
  border-radius: 7px;
  overflow: hidden;
  height: 0;
  transition: padding 0.3s ease-in-out, height 0.3s ease-in-out;

  &__item {
    text-align: center;
    padding: 10px 15px;
    font-family: "Ubuntu", "Work Sans", sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    color: var(--black);
    transition: background-color 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: var(--info);
    }
  }
}

.open {
  height: 150px;
  overflow: auto;
  padding: 10px 0;
  box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.1);
}

.rotate {
  transform: translateY(-50%) rotate(180deg);
}
.message {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
}

.success {
  color: var(--success);
}

.error {
  color: var(--error);
}

.feed-list {
  display: flex;
  flex-direction: column;

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 23.5px;
    }

    &::after {
      content: "";
      position: absolute;
      top: 75%;
      left: 0;
      width: 100%;
      border-bottom: 1px dashed var(--black);
      z-index: 1;
    }
  }

  &__currencies {
    font-weight: 600;
    font-size: 20px;
    line-height: 23px;
    letter-spacing: 0.1em;
    background-color: var(--gray-8);
    z-index: 2;
  }

  &__change {
    display: flex;
    align-items: center;
    gap: 15px;
    background-color: var(--gray-8);
    z-index: 2;
  }

  &__amount {
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    letter-spacing: 0.1em;
  }
}
</style>
