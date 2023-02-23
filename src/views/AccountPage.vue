<template>
  <div class="container account__container">
    <div class="account__top">
      <div class="account__left">
        <h1 class="heading-reset account__heading">Просмотр счёта</h1>
        <div class="account__number">№ {{ accountNumber }}</div>
      </div>
      <div class="account__right">
        <router-link :to="{ name: 'accounts' }" class="btn btn-primary">
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
        <div class="account__balance"><span>Баланс</span> 31 235 ₽</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountPage",
  data() {
    return {
      accountNumber: this.$route.params.account,
    };
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

  &__top {
    padding-top: 50px;
    padding-bottom: 50px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
}
</style>
