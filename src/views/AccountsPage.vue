<template>
  <div class="accounts">
    <base-spinner v-if="pageLoading" />
    <load-error v-if="loadFailed" :callback="loadAccountsData" />
    <div v-if="pageIsLoaded" class="container accounts__container">
      <div class="accounts__top">
        <h1 class="heading-reset accounts__heading">Ваши счета</h1>
        <div
          class="accounts__dropdown sort-dropdown"
          @click="toggleDropdownList"
        >
          <div
            class="sort-dropdown__selected"
            :class="{ rotate: sortListOpen }"
          >
            Сортировка
          </div>
          <ul
            @click.stop
            class="list-reset sort-dropdown__list"
            :class="{ isOpen: sortListOpen }"
          >
            <li
              @click="selectSortBy"
              data-target="account"
              class="sort-dropdown__item"
            >
              <span>
                По номеру
                <svg
                  v-if="sortBy.account"
                  width="18"
                  height="14"
                  viewBox="0 0 18 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.00003 11.17L1.83003 7.00003L0.410034 8.41003L6.00003 14L18 2.00003L16.59 0.590027L6.00003 11.17Z"
                    fill="#182233"
                  />
                </svg>
              </span>
            </li>
            <li
              @click="selectSortBy"
              data-target="balance"
              class="sort-dropdown__item"
            >
              <span
                >По балансу
                <svg
                  v-if="sortBy.balance"
                  width="18"
                  height="14"
                  viewBox="0 0 18 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.00003 11.17L1.83003 7.00003L0.410034 8.41003L6.00003 14L18 2.00003L16.59 0.590027L6.00003 11.17Z"
                    fill="#182233"
                  />
                </svg>
              </span>
            </li>
            <li
              @click="selectSortBy"
              data-target="transaction"
              class="sort-dropdown__item"
            >
              <span>
                По последней транзакции
                <svg
                  v-if="sortBy.transaction"
                  width="18"
                  height="14"
                  viewBox="0 0 18 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.00003 11.17L1.83003 7.00003L0.410034 8.41003L6.00003 14L18 2.00003L16.59 0.590027L6.00003 11.17Z"
                    fill="#182233"
                  />
                </svg>
              </span>
            </li>
          </ul>
        </div>
        <button
          class="btn btn-primary accounts__button"
          @click.prevent="createNewAccount"
          :disabled="creatingAccount"
        >
          Создать новый счет
        </button>
      </div>
      <accounts-list :accounts="accountsData" />
    </div>
    <base-popup v-model:is-open="popupOpen">
      <span>
        При создании нового счета что-то пошло не так... Повторите попытку позже
      </span>
    </base-popup>
  </div>
</template>

<script>
import BaseSpinner from "@/components/BaseSpinner";
import BasePopup from "@/components/BasePopup";
import AccountsList from "@/components/AccountsList";
import LoadError from "@/components/LoadError";
import axios from "axios";
import { BASE_URL } from "@/api/api.config";

export default {
  name: "AccountsPage",
  components: { BaseSpinner, BasePopup, AccountsList, LoadError },

  data() {
    return {
      accountsData: [],
      pageLoading: true,
      pageIsLoaded: false,
      loadFailed: false,
      sortListOpen: false,
      sortBy: {},
      creatingAccount: false,
      popupOpen: false,
    };
  },

  methods: {
    createNewAccount() {
      this.creatingAccount = true;

      axios
        .post(
          `${BASE_URL}/create-account`,
          {},
          {
            headers: {
              Authorization: `Basic ${this.$store.state.authToken}`,
            },
          }
        )
        .then((res) => {
          if (!res.data.payload) {
            this.popupOpen = true;
          }

          this.accountsData.push(res.data.payload);
          this.creatingAccount = false;
        })
        .catch(() => {
          this.popupOpen = true;
        });
    },

    loadAccountsData() {
      this.pageLoading = true;
      this.loadFailed = false;

      axios
        .get(`${BASE_URL}/accounts`, {
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

          this.accountsData = res.data.payload;
          this.pageIsLoaded = true;
          this.pageLoading = false;
          this.loadFailed = false;
        })
        .catch(() => {
          this.pageLoading = false;
          this.loadFailed = true;
        });
    },

    toggleDropdownList() {
      this.sortListOpen = !this.sortListOpen;
    },

    selectSortBy(event) {
      this.sortBy = {};
      this.sortBy[event.currentTarget.dataset.target] = true;
      this.sortListOpen = false;
    },
  },

  watch: {
    sortBy: function (newState) {
      // eslint-disable-next-line no-prototype-builtins
      if (newState.hasOwnProperty("account")) {
        return this.accountsData.sort((a, b) =>
          a.account < b.account ? 1 : -1
        );
        // eslint-disable-next-line no-prototype-builtins,no-dupe-else-if
      } else if (newState.hasOwnProperty("balance")) {
        return this.accountsData.sort((a, b) =>
          a.balance < b.balance ? 1 : -1
        );
        // eslint-disable-next-line no-prototype-builtins
      } else if (newState.hasOwnProperty("transaction")) {
        return this.accountsData.sort((a, b) =>
          a.transactions[0]?.date < b.transactions[0]?.date ? 1 : -1
        );
      }
    },
  },

  created() {
    if (!this.$store.state.authToken) {
      this.$router.push({ name: "auth" });
    }
    this.loadAccountsData();
  },
};
</script>

<style lang="scss" scoped>
.accounts {
  &__container {
    padding-bottom: 50px;
  }

  &__top {
    display: flex;
    align-items: center;
    padding-top: 50px;
    padding-bottom: 79px;
  }

  &__heading {
    margin-right: 35px;
  }

  &__button {
    padding-left: 58px;
    position: relative;
    margin-left: auto;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 24px;
      transform: translateY(-50%);
      width: 18px;
      height: 0;
      border: 1px solid var(--white);
      transition: transform 0.3s ease-in-out;
    }

    &::before {
      content: "";
      position: absolute;
      left: 24px;
      top: 50%;
      transform: translateY(-50%) rotate(90deg);
      width: 18px;
      height: 0;
      border: 1px solid var(--white);
      transition: transform 0.3s ease-in-out;
    }

    &:hover {
      &::after {
        transform: translateY(-50%) rotate(90deg);
      }

      &::before {
        transform: translateY(-50%) rotate(180deg);
      }
    }
  }
}

.sort-dropdown {
  max-width: 300px;
  width: 100%;
  position: relative;
  padding: 10px 16px;
  border: 1px solid var(--primary);
  border-radius: 7px;
  font-family: "Ubuntu", "Work Sans", sans-serif;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.01em;
  cursor: pointer;

  &__list {
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    width: 100%;
    padding: 0;
    height: 0;
    overflow: hidden;
    border-radius: 7px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
    background-color: var(--white);
    transition: height 0.3s ease-in-out, padding 0.3s ease-in-out;
  }

  &__selected {
    position: relative;

    &::before {
      content: "";
      display: block;
      width: 0;
      border-top: 6px solid var(--secondary-1);
      border-right: 6px solid transparent;
      border-left: 6px solid transparent;
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      transition: transform 0.3s ease-in-out;
    }
  }

  &__item {
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: var(--info);
    }

    & span {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
    }
  }
}

.isOpen {
  height: 152px;
  padding: 10px 0;
}

.rotate {
  &::before {
    transform: translateY(-50%) rotate(180deg);
  }
}
</style>
