<template>
  <div class="history">
    <h2 class="heading-reset history__heading">История переводов</h2>
    <div class="history__table table">
      <ul class="table__head list-reset">
        <li class="table__item">Счёт отправителя</li>
        <li class="table__item">Счёт получателя</li>
        <li class="table__item">Сумма</li>
        <li class="table__item">Дата</li>
      </ul>
      <div
        class="table__row row"
        v-for="(transaction, index) in slicedTransactions"
        :key="index"
      >
        <div class="row__from row__item">{{ transaction.from }}</div>
        <div class="row__to row__item">{{ transaction.to }}</div>
        <div
          class="row__amount row__item"
          :class="transaction.from !== accountNumber ? 'positive' : 'negative'"
        >
          {{ formattedAmount(transaction.from, transaction.amount) }}
        </div>
        <div class="row__date row__item">
          {{ formattedDate(transaction.date) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TransactionHistory",
  props: {
    lineCount: {
      require: true,
      type: Number,
      default: 10,
    },
    transactionsData: {
      require: true,
      type: Object,
      default: () => {},
    },
    accountNumber: {
      require: true,
    },
  },

  methods: {
    formattedDate(date) {
      const formattedDate = new Date(date);

      return formattedDate.toLocaleDateString();
    },

    formattedAmount(from, amount) {
      if (from !== this.accountNumber) {
        return `+${amount.toLocaleString("ru")}`;
      }

      return `-${amount.toLocaleString("ru")}`;
    },
  },

  computed: {
    slicedTransactions() {
      let slicedTransactions = this.transactionsData;

      return slicedTransactions.reverse().slice(0, 10);
    },
  },
};
</script>

<style lang="scss" scoped>
.history {
  width: 100%;
  background-color: var(--gray-7);
  border-radius: 56px;
  padding: 25px 50px 66px;

  &__heading {
    margin-bottom: 25px;
    font-size: 20px;
    line-height: 23px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
}

.table {
  &__head {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    align-items: center;
    padding: 20px 50px;
    border-radius: 15px;
    background-color: var(--primary);
  }

  &__item {
    font-family: "Ubuntu", "Work Sans", sans-serif;
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: var(--white);

    &:first-child {
      grid-area: 1 / 1 / 2 / 3;
    }

    &:nth-child(2) {
      grid-area: 1 / 3 / 2 / 5;
    }
  }
}

.row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: center;
  padding: 21px 54px 26px;
  border-bottom: 2px solid rgba(0, 82, 255, 0.1);

  &__item {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.01em;
    color: var(--gray-2);

    &:first-child {
      grid-area: 1 / 1 / 2 / 3;
    }

    &:nth-child(2) {
      grid-area: 1 / 3 / 2 / 5;
    }
  }
}

.positive {
  color: var(--success);
}

.negative {
  color: var(--error);
}
</style>
