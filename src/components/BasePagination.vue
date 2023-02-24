<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a
        href="#"
        class="pagination__link pagination__link--arrow pagination__link--arrow-left"
        :class="{ 'pagination__link--disabled': currentPage === 1 }"
        aria-label="Предыдущая страница"
        @click.prevent="saveCurrentPage(paginationBackward)"
      >
      </a>
    </li>
    <li class="pagination__item" v-for="page in pages" :key="page">
      <a
        href="#"
        class="pagination__link"
        :class="page === +this.currentPage ? 'pagination__link--current' : ''"
        @click.prevent="saveCurrentPage(page)"
      >
        {{ page }}
      </a>
    </li>
    <li class="pagination__item">
      <a
        href="#"
        class="pagination__link pagination__link--arrow"
        :class="{ 'pagination__link--disabled': currentPage >= pages }"
        aria-label="Следующая страница"
        @click.prevent="saveCurrentPage(paginationForward)"
      >
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "BasePagination",
  props: ["count", "countOnPage", "currentPage"],

  computed: {
    pages() {
      return 15;
    },

    paginationForward() {
      return this.currentPage >= this.pages
        ? +this.currentPage
        : +this.currentPage + 1;
    },

    paginationBackward() {
      return this.currentPage === 1 ? +this.currentPage : +this.currentPage - 1;
    },
  },

  methods: {
    saveCurrentPage(page) {
      this.$emit("update:currentPage", page);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  margin: 0;
  padding: 0;
  list-style: none;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;

  &:first-child {
    margin-right: 25px;
  }

  &:last-child {
    margin-left: 25px;
  }

  &__link {
    position: relative;
    display: block;
    padding: 13px 3px;
    height: 40px;
    min-width: 40px;
    font-size: 16px;
    line-height: 1;
    color: #222;
    text-align: center;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }

  &__link[href]:not(:disabled):focus,
  &__link[href]:not(:disabled):hover {
    opacity: 0.6;
  }

  &__link--current {
    font-weight: 700;
  }

  &__link--arrow {
    position: relative;
    border: 1px solid var(--primary);
    border-radius: 7px;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      width: 8px;
      height: 8px;
      border-bottom: 2px solid var(--primary);
      border-right: 2px solid var(--primary);
    }

    &-left {
      &::after {
        transform: translate(-50%, -50%) rotate(135deg);
      }
    }
  }

  &__link--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
