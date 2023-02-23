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
    ...mapMutations({ updateAuthToken: "updateAuthToken" }),
  },

  created() {
    const token = localStorage.getItem("token");

    if (token) {
      this.updateAuthToken(token);
    }
  },
};
</script>
