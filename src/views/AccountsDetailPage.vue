<template>
  <div>accounts detail №{{ accountNumber }}</div>
</template>

<script>
export default {
  name: "AccountsDetailPage",
  data() {
    return {
      accountNumber: this.$route.params.account,
    };
  },
};
</script>

<style lang="scss" scoped></style>
