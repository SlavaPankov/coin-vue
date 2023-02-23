<template>
  <div class="error">
    <span>Что-то пошло не так...</span>
    <button class="btn btn-primary" @click.prevent="callback">
      Попробовать снова
    </button>
  </div>
</template>

<script>
export default {
  name: "LoadError",
  props: {
    callback: {
      require: true,
      type: Function,
    },
  },
};
</script>

<style lang="scss" scoped>
.error {
  height: 80vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  & span {
    display: inline-block;
    margin-bottom: 25px;
    font-size: 16px;
    line-height: 20px;
    font-weight: 400;
  }
}
</style>
