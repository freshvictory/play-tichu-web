<template>
  <div id="home" :class="$style.home">
    <h1>Tichu?</h1>

    <div :class="$style.start">
      <NewGame/>
    </div>
  </div>
</template>

<script>
import NewGame from '@/components/NewGame.vue';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Home',
  components: {
    NewGame,
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.home {
  margin: 20px;
  display: grid;
  grid-template-rows: max-content 1fr;
  row-gap: @px-grid-gap;
}

.start {
  margin: 0 auto;
  padding: @px-grid-gap;
  display: grid;
  row-gap: @px-grid-gap;
}
</style>
