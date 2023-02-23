<template>
  <header class="header">
    <div class="header__container">
      <router-link :to="{ name: 'home' }" class="header__logo">
        Coin.
      </router-link>
      <nav class="nav header__nav" title="Навигация" v-if="isAuth">
        <ul class="nav__list list-reset">
          <li class="nav__item">
            <router-link
              :to="{ name: 'banks' }"
              href="#"
              class="nav__link btn btn-white"
              :class="{ 'nav__link--active': this.$route.name === 'banks' }"
            >
              Банкоматы
            </router-link>
          </li>
          <li class="nav__item">
            <router-link
              :to="{ name: 'accounts' }"
              href="#"
              class="nav__link btn btn-white"
              :class="{
                'nav__link--active':
                  this.$route.name === 'accounts' ||
                  this.$route.name === 'account',
              }"
            >
              Счета
            </router-link>
          </li>
          <li class="nav__item">
            <router-link
              :to="{ name: 'currencies' }"
              href="#"
              class="nav__link btn btn-white"
              :class="{
                'nav__link--active': this.$route.name === 'currencies',
              }"
            >
              Валюта
            </router-link>
          </li>
          <li class="nav__item">
            <a href="#" class="nav__link btn btn-white" @click.prevent="logOut">
              Выйти
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "MainHeader",

  computed: {
    isAuth() {
      return this.$store.state.authToken !== "";
    },
  },

  methods: {
    ...mapMutations({ updateAuthToken: "updateAuthToken" }),

    logOut() {
      const token = localStorage.getItem("token");

      if (token) {
        localStorage.removeItem("token");
        this.$router.push({ name: "auth" });
        this.updateAuthToken("");
      }
    },
  },
};
</script>

<style lang="scss">
.header {
  background-color: var(--primary);
  padding: 25px 50px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);

  &__container {
    display: flex;
    align-items: center;
  }

  &__logo {
    font-size: 48px;
    line-height: 56px;
    font-weight: 300;
    color: var(--white);
  }

  &__nav {
    margin-left: auto;
  }
}

.nav {
  &__list {
    display: flex;
    align-items: center;
  }

  &__item:not(:last-child) {
    margin-right: 25px;
  }

  &__link {
    &--active {
      background-color: var(--info) !important;
    }
  }
}
</style>
