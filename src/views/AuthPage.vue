<template>
  <div class="auth">
    <div class="auth__container">
      <h1 class="auth__heading heading-reset">Вход в аккаунт</h1>
      <form action="#" method="post" class="auth__form" @submit.prevent="Auth">
        <label for="login" class="auth__label">
          <span>Логин</span>
          <input
            type="text"
            id="login"
            class="input-reset auth__input"
            placeholder="Введите ваш логин"
            v-model="formData.login"
          />
        </label>
        <label for="password" class="auth__label">
          <span>Пароль</span>
          <input
            type="password"
            name="password"
            id="password"
            class="input-reset auth__input"
            placeholder="Введите ваш пароль"
            v-model="formData.password"
          />
        </label>
        <div class="auth__error" v-if="loginFailed">
          Не верный логин или пароль
        </div>
        <button
          type="submit"
          class="btn btn-primary auth__btn"
          :disabled="loginProceed"
        >
          <span v-if="!loginProceed">Войти</span>
          <span v-if="loginProceed">Подождите...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
import { BASE_URL } from "@/api/api.config";

export default {
  name: "AuthPage",

  data() {
    return {
      formData: {},
      loginProceed: false,
      loginFailed: false,
    };
  },

  methods: {
    ...mapMutations({ updateAuthToken: "updateAuthToken" }),

    Auth() {
      this.loginProceed = true;

      axios
        .post(`${BASE_URL}/login`, {
          ...this.formData,
        })
        .then((res) => {
          if (res.data.payload) {
            this.updateAuthToken(res.data.payload.token);
            localStorage.setItem("token", res.data.payload.token);
            this.$router.push({ name: "accounts" });
          } else {
            this.loginFailed = true;
            this.loginProceed = false;
          }
        })
        .catch(() => {
          this.loginFailed = true;
          this.loginProceed = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.auth {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &__container {
    max-width: 500px;
    width: 100%;
    padding: 50px 85px 50px 50px;
    background-color: var(--gray-7);
    border-radius: 50px;
  }

  &__heading {
    margin-bottom: 35px;
    font-size: 34px;
    line-height: 39.88px;
    letter-spacing: -2%;
    font-weight: 700;
    color: var(--black);
    text-align: center;
  }

  &__form {
    display: flex;
    flex-direction: column;
  }

  &__label {
    width: 100%;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "Ubuntu", "Work Sans", sans-serif;
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    letter-spacing: -1%;
    color: var(--black);

    &:last-child {
      margin-bottom: 30px;
    }

    & span {
      margin-right: 18px;
      display: inline-block;
      max-width: 57px;
      width: 100%;
      text-align: right;
    }
  }

  &__input {
    max-width: 300px;
    width: 100%;
    padding: 10px 16px;
    border: 1px solid var(--gray-5);
    border-radius: 7px;
    font-family: "Ubuntu", "Work Sans", sans-serif;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -1%;
    background-color: var(--white);
    color: var(--black);

    &::placeholder {
      color: var(--gray-4);
    }
  }

  &__btn {
    margin-left: 75px;
  }

  &__error {
    font-size: 14px;
    font-weight: 400;
    color: var(--error);
  }
}
</style>
