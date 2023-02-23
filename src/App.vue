<template>
  <main-header />

  <router-view />
</template>

<script>
import MainHeader from "@/components/MainHeader";
import { mapMutations } from "vuex";

export default {
  components: { MainHeader },
  methods: {
    ...mapMutations({
      updateAuthToken: "updateAuthToken",
      updateAutofillList: "updateAutofillList",
    }),
  },

  created() {
    const token = localStorage.getItem("token");
    const autofillList = JSON.parse(localStorage.getItem("autofillList"));

    if (token) {
      this.updateAuthToken(token);
    } else {
      this.$router.push({ name: "auth" });
    }

    if (autofillList && autofillList.length > 0) {
      autofillList.forEach((item) => {
        this.updateAutofillList(item);
      });
    }
  },
};
</script>
