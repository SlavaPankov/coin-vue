<template>
  <div>home page</div>
</template>

<script>
export default {
  name: "HomePage",

  created() {
    if (this.$store.state.authToken === "") {
      this.$router.push({ name: "auth" });
    } else {
      this.$router.push({ name: "accounts" });
    }
  },
};
</script>

<style scoped></style>
