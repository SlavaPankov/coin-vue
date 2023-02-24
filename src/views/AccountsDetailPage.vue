<template>
  <div v-if="pageIsLoaded" class="account-detail container">
    <account-head :account-number="accountNumber" :balance="balance" />
    <div class="chart">
      <base-bar
        :current-account="accountNumber"
        :config="transactions"
        month-count="11"
      />
    </div>
    <div class="chart chart--stacked">
      <base-bar
        :current-account="accountNumber"
        :config="transactions"
        month-count="11"
        is-stacked="true"
      />
    </div>
    <div class="history">
      <transaction-history
        :transactions-data="paginatedTransactions"
        :account-number="accountNumber"
      />
    </div>
    <base-pagination
      v-model:currentPage.number="currentPage"
      :count="countTransactions"
      :count-on-page="countOnPage"
    />
  </div>
  <base-spinner v-if="pageLoading" />
  <load-error v-if="loadingFailed" :callback="loadAccountData" />
</template>

<script>
import TransactionHistory from "@/components/TransactionHistory";
import BasePagination from "@/components/BasePagination";
import AccountHead from "@/components/AccountHead";
import BaseSpinner from "@/components/BaseSpinner";
import LoadError from "@/components/LoadError";
import BaseBar from "@/components/BaseBar";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "AccountsDetailPage",
  components: {
    AccountHead,
    BaseBar,
    BaseSpinner,
    LoadError,
    TransactionHistory,
    BasePagination,
  },
  data() {
    return {
      currentPage: 1,
      countOnPage: 25,
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
      transactions: "getTransactions",
    }),

    countTransactions() {
      return this.accountData ? this.transactions.length : 0;
    },

    paginatedTransactions() {
      return this.transactions.slice(
        this.countOnPage * (this.currentPage - 1),
        this.countOnPage * this.currentPage
      );
    },
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
.account-detail {
  padding-bottom: 50px;
}

.chart {
  width: 100%;
  margin-bottom: 50px;
}

.history {
  margin-bottom: 20px;
}
</style>
