<script setup lang="ts">
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'
import SadSmileIcon from '@/components/icons/SadSmileIcon.vue'

import { States } from '@/types/types'

const props = defineProps({
  errMsg: String,
  state: Number
})

function show() {
  if (!props.state) return false
  return [States.loading, States.new].includes(props.state)
}
</script>

<template>
  <div class="abs-xy-center spinner" v-if="show()">
    <SpinnerIcon class="rotating" />
  </div>

  <div class="abs-xy-center load-error-wrap" v-if="props.state === States.error">
    <div class="flex-column flex-align-center load-error">
      <span class="error-text">{{ props.errMsg }}</span>
      <SadSmileIcon class="sad-smile" />
    </div>
  </div>
</template>

<style>
.spinner {
  position: absolute;
  width: 100px;
  height: 100px;
}

.load-error-wrap {
  position: absolute;
  min-width: 320px;
}

.load-error {
  row-gap: 40px;
}

.sad-smile {
  width: 150px;
  height: 150px;
}

.error-text {
  font-size: 24px;
  color: red;
}
</style>
