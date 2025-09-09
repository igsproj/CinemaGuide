<script setup lang="ts">
import CloseIcon from '@/components/icons/CloseIcon.vue'
import { ref, onUpdated } from 'vue'
import type { IButtonsDlg } from '@/lib/interfaces-rt'

const props = defineProps({
  buttons: Array,
  message: String,
  descr: String,
  show: Boolean,
  disableCloseBtn: Boolean,
  update: Boolean
})

const form = ref()
const mainBtn = ref()

onUpdated(() => {
  if (!props.update) return

  if (mainBtn.value) mainBtn.value.focus()

  if (form.value) {
    for (let i = 0; i < form.value.length; ++i)
      if (form.value[i].localName === 'input') {
        form.value[i].focus()
        break
      }
  }
})

function getButton(index: number) {
  if (!props.buttons || !props.buttons[index]) return null

  const btn = props.buttons[index] as IButtonsDlg
  return btn
}

function getButtonAttr(index: number, descr: string): string {
  const res = getButton(index)

  return res ? res[descr] : ''
}
</script>

<template>
  <div
    v-if="props.show"
    class="overlay"
    @keydown.enter="$emit(getButtonAttr(0, 'event'), form)"
    @keydown.esc="$emit('close')"
  >
    <div class="flex-column flex-justify-spb dlg-box abs-xy-center">
      <button class="flat-btn close-btn" @click="$emit('close')" v-if="!props.disableCloseBtn">
        <CloseIcon class="close-icon" />
      </button>

      <img class="logo dlg-logo" src="@/assets/img/logo.svg" alt="" />

      <span class="dlg-message" v-if="props.message">{{ props.message ?? '' }}</span>
      <span class="dlg-descr" v-if="props.descr">{{ props.descr ?? '' }}</span>

      <div class="flex-column dlg-controls">
        <form ref="form">
          <slot></slot>
        </form>
        <button
          v-if="getButton(0)"
          class="flat-btn dlg-main-btn"
          ref="mainBtn"
          @click="$emit(getButtonAttr(0, 'event'), form)"
        >
          {{ getButtonAttr(0, 'text') }}
        </button>
        <button
          v-if="getButton(1)"
          class="flat-btn dlg-second-btn"
          @click="$emit(getButtonAttr(1, 'event'))"
          @keydown.enter="$emit(getButtonAttr(1, 'event'))"
        >
          {{ getButtonAttr(1, 'text') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.dlg-second-btn {
  align-self: center;
  font-family: 'Play';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: var(--palette-col6);
}

.dlg-logo {
  width: 180px;
  height: 24px;
  align-self: center;
}

.dlg-message {
  align-self: center;
  color: var(--palette-col6);
  font-family: 'Play';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
}

.dlg-descr {
  align-self: center;
  color: var(--palette-col6);
  text-align: center;

  font-family: 'Play';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
}

.dlg-controls {
  row-gap: 24px;
}

.dlg-box {
  position: fixed;
  z-index: 10;
  gap: 40px;
  background: var(--palette-col4);
  border-radius: 24px;
}

.modal-dlg {
  position: fixed;
  width: 300px;
  height: 150px;
  background-color: cadetblue;
  border-radius: 16px;
  padding: 20px 10px;
  row-gap: 40px;
}

.dlg-buttons {
  column-gap: 20px;
}

.dlg-button {
  color: var(--palette-col4);
  padding: 10px 10px;
  background-color: var(--palette-col5);
  padding: 16px 48px;
  border-radius: 28px;
}
</style>
