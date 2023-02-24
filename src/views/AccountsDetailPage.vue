<template>
  <div v-if="pageIsLoaded" class="account-detail container">
    <account-head :account-number="accountNumber" :balance="balance" />
    <div class="chart">
      <base-bar
        :current-account="accountNumber"
        :config="accountData.transactions"
        month-count="11"
      />
    </div>
    <div class="chart chart--stacked">
      <base-bar
        :current-account="accountNumber"
        :config="accountData.transactions"
        month-count="11"
        is-stacked="true"
      />
    </div>
  </div>
  <base-spinner v-if="pageLoading" />
  <load-error v-if="loadingFailed" :callback="loadAccountData" />
</template>

<script>
import AccountHead from "@/components/AccountHead";
import BaseSpinner from "@/components/BaseSpinner";
import LoadError from "@/components/LoadError";
import BaseBar from "@/components/BaseBar";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "AccountsDetailPage",
  components: { AccountHead, BaseBar, BaseSpinner, LoadError },
  data() {
    return {
      pageLoading: true,
      pageIsLoaded: false,
      loadingFailed: false,
    };
  },

  computed: {
    ...mapGetters({
      accountData: "getAccountData",
      accountNumber: "getAccountNumber",
      balance: "getBalance",
    }),
  },

  methods: {
    ...mapActions({ loadAccountDataFromStore: "loadAccountData" }),
    ...mapMutations({ updateAccountNumber: "updateAccountNumber" }),

    loadAccountData() {
      this.pageLoading = true;
      this.loadingFailed = false;

      this.loadAccountDataFromStore()
        .then((res) => {
          if (!res) {
            this.pageLoading = false;
            this.loadingFailed = true;
            return;
          }

          this.pageLoading = false;
          this.pageIsLoaded = true;
        })
        .catch(() => {
          this.pageLoading = false;
          this.loadingFailed = true;
        });
    },
  },

  created() {
    this.updateAccountNumber(this.$route.params.account);
    this.loadAccountData();
  },
};
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  margin-bottom: 50px;
}
</style>
