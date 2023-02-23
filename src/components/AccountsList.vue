<template>
  <ul class="list-reset accounts-list">
    <li
      class="accounts-list__item"
      v-for="account in accounts"
      :key="account.account"
    >
      <article class="accounts-card">
        <span class="accounts-card__number">{{ account.account }}</span>
        <span class="account-card__balance">{{ account.balance }} ₽</span>
        <div class="accounts-card__bottom">
          <div class="accounts-card__transactions">
            Последняя транзакция:
            <span
              class="accounts-card__date"
              v-if="account.transactions.length > 0"
            >
              {{ formattedDate(account.transactions[0].date) }}
            </span>
            <span class="accounts-card__date" v-else>
              Транзакций не обнаружено
            </span>
          </div>
          <router-link
            class="btn btn-primary"
            :to="{ name: 'account', params: { account: account.account } }"
          >
            Открыть
          </router-link>
        </div>
      </article>
    </li>
  </ul>
</template>

<script>
export default {
  name: "AccountsList",
  props: {
    accounts: {
      require: true,
      type: Array,
      default() {
        return [];
      },
    },
  },

  methods: {
    formattedDate(uglyDate) {
      const date = new Date(uglyDate);

      return `${date.getDate()}-${date.getMonth() + 1 < 10 ? "0" : ""}${
        date.getMonth() + 1
      }-${date.getFullYear()}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.accounts-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 50px 70px;

  &__item {
    max-width: 400px;
    width: 100%;
    padding: 22px;
    background-color: var(--white);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
    border-radius: 9px;
  }
}
.accounts-card {
  display: flex;
  flex-direction: column;

  &__number {
    font-family: "Roboto", "Work Sans", sans-serif;
    margin-bottom: 9px;
    font-size: 18px;
    line-height: 22px;
    font-weight: 500;
    color: var(--secondary-1);
  }

  &__balance {
    margin-bottom: 9px;
    font-family: "Ubuntu", "Work Sans", sans-serif;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: var(--secondary-1);
  }

  &__bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__transactions {
    font-size: 13px;
    line-height: 15px;
    font-weight: 700;
    color: var(--black);
    letter-spacing: -0.02em;
  }

  &__date {
    display: block;
    font-weight: 400;
  }
}
</style>
