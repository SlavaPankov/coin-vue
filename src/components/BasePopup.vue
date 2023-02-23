<template>
  <div v-if="isOpen" class="backdrop" @click="close">
    <div class="popup" @click.stop>
      <h1>Внимание!</h1>
      <hr />
      <slot></slot>
      <hr />
      <div class="footer">
        <button class="btn btn-primary popup__btn" @click.prevent="close">
          Ок
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BasePopup",
  props: {
    isOpen: {
      require: true,
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  },

  methods: {
    handleKeydown(e) {
      if (this.isOpen && (e.key === "Escape" || e.key === "Enter")) {
        this.close();
      }
    },

    close() {
      this.$emit("update:isOpen", false);
    },
  },
};
</script>

<style scoped lang="scss">
.popup {
  top: 50px;
  padding: 20px;
  left: 50%;
  transform: translateX(-50%);
  position: fixed;
  z-index: 101;
  background-color: white;
  border-radius: 10px;

  &__btn {
    margin-left: auto;
  }
}

.popup h1 {
  text-align: center;
  margin: 0;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 100;
}

.footer {
  text-align: right;
}
</style>
