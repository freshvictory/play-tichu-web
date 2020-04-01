<template>
  <div>
    <span>History</span>
    <ul :class="$style.actions">
      <li v-for="(action, index) in actions" :key="index">
        <strong v-if="action.rewind">rw: </strong>
        {{action.stageState.lastAction ? action.stageState.lastAction : 'unknown'}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
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

.actions {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  list-style-type: square;
  list-style-position: inside;
}
</style>
