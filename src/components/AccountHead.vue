<template>
  <div class="account__head">
    <div class="account__top">
      <h1 class="heading-reset account__heading">Просмотр счёта</h1>
      <button
        @click="this.$router.go(-1)"
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
      </button>
    </div>
    <div class="account__bottom">
      <div class="account__number">№ {{ accountNumber }}</div>
      <div class="account__balance">
        <span>Баланс</span>
        {{ formattedCurrency(balance) }} ₽
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountHead",
  props: {
    accountNumber: {
      require: true,
    },
    balance: {
      require: true,
    },
  },

  methods: {
    formattedCurrency(value) {
      return value.toLocaleString("ru");
    },
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
</style>
