<template>
  <div id="home" :class="$style.home">
    <h1>{{gameType | capitalize}}?</h1>

    <div :class="$style.start">
      <NewGame v-on:changegame="changeGame" :gameType="gameType" />
    </div>
  </div>
</template>

<script lang="ts">
import NewGame from '@/components/NewGame.vue';
import { defineComponent, ref } from '@vue/composition-api';
import { GameType } from '@/logic/game';

export default defineComponent({
  name: 'Home',
  components: {
    NewGame,
  },
  filters: {
    capitalize: (value: string) => {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  setup: () => {
    const gameType = ref<GameType>('tichu');
     
    const changeGame = () => {
      if(gameType.value === 'tichu') gameType.value = 'gems';
      else gameType.value = 'tichu';
    }

    return {
      gameType,
      changeGame
    };
  }
});
</script>

<style lang="less" module>
@import '../shared.less';

.home {
  padding: @px-grid-gap;
  height: 100vh;
  display: grid;
  grid-template-rows: 200px 1fr;
  align-items: center;
  row-gap: @px-grid-gap;
}

.start {
  margin: 0 auto;
  padding: @px-grid-gap;
  display: grid;
  row-gap: @px-grid-gap;
  transform: translateY(-100%);
}
</style>
