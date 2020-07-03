<template>
  <div :class="$style.container">
    <ul :class="$style.actions">
      <li v-for="(action, index) in actions" :key="index">
        <strong>{{action.stageState.sequence}}.</strong>
        <strong v-if="action.rewind">rw to: </strong>
        {{action.stageState.lastAction ? action.stageState.lastAction : 'unknown'}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { SerializedState } from '../logic/state';

export default defineComponent({
  name: 'History',
  props: {
    actions: { type: Array as () => SerializedState[], required: true }
  },
  setup: () => {
    return {
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.container {
  background-color: #5e5e5e;
  box-shadow: 3px 3px;
  padding: @px-grid-gap;
  border-radius: 25px;
}

.actions {
  text-align: left;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: max-content;

  list-style-type: none;
}
</style>
