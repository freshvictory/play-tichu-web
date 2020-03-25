<template>
  <header :class="$style.header">
    <h1>{{ stage }}</h1>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import store from '../store';

export default defineComponent({
  name: 'Header',
  setup: () => {
    const stage = computed(() => store.state.state.stage);

    return {
      stage
    };
  }
});
</script>

<style lang="less" module>
.header {
  height: 50px;
}
</style>
