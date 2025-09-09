<script setup lang="ts">
import SearchIcon from '@/components/icons/SearchInputIcon.vue'
import CrossIcon from '@/components/icons/CrossIcon.vue'
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  setFocus: Boolean,
  resetInput: Boolean,
  inputDebounce: Number,
  clearVisibleAlways: Boolean
})

const emits = defineEmits(['inputText', 'clearText', 'searchStart'])
const input = ref(null)
const clearVisible = ref(false)

let debounceTimer: ReturnType<typeof setTimeout>

onMounted(() => {
  if (props.setFocus && input.value) (input.value as HTMLInputElement).focus()
})

watch(
  () => props.resetInput,
  (newVal, oldVal) => {
    if (newVal) {
      if (input.value) (input.value as HTMLInputElement).value = ''
      setClearVisible(false)
      emits('clearText')
    }
  }
)

setClearVisible(false)

function onInput(ev: Event) {
  setClearVisible(Boolean(input.value ? (input.value as HTMLInputElement).value.length : 0))

  clearTimeout(debounceTimer)
  // input debounce
  if (clearVisible.value && (props.inputDebounce ?? 0) > 0) {
    debounceTimer = setTimeout(() => emits('inputText', ev), props.inputDebounce)
  } else emits('inputText', ev)
}

function onClear(ev: Event) {
  if (input.value) {
    ;(input.value as HTMLInputElement).value = ''
    setClearVisible(false)
    emits('clearText', ev)
  }
}

function setClearVisible(val: boolean) {
  clearVisible.value = props.clearVisibleAlways ? true : val
}
</script>

<template>
  <div class="search-wrap" name="searchInput">
    <input
      ref="input"
      type="text"
      placeholder="Поиск"
      class="search-input"
      @input="(ev) => onInput(ev)"
    />

    <div class="search-icon-wrap abs-y-center" name="searchInput">
      <button
        class="flat-btn owner-size-click search-btn-inline"
        @click="(ev) => emits('searchStart')"
      >
        <SearchIcon />
      </button>
    </div>

    <div
      @click="
        (ev) => {
          onClear(ev)
          onInput(ev)
        }
      "
      class="clear-icon-wrap owner-size-click abs-y-center flex-row flex-align-center flex-justify-center"
      name="searchInput"
      v-show="clearVisible"
    >
      <button class="flat-btn owner-size-click clear-btn">
        <CrossIcon :class="props.clearVisibleAlways ? 'white-cross' : ''" />
      </button>
    </div>
  </div>
</template>

<style>
.white-cross path {
  fill-opacity: 1;
}

.search-wrap {
  position: relative;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 16px 45px 16px 52px;
  color: var(--palette-col4);
  border: none;
  background: var(--palette-col2);
  border-radius: 8px;

  font-family: 'Play';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  color: var(--palette-col12);
}

.clear-btn {
  width: 14px;
  height: 14px;
}

.search-btn-inline {
  width: 21px;
  height: 21px;
}

.search-icon-wrap {
  position: absolute;
  left: 18px;
  width: 21px;
  height: 21px;
}

.clear-icon-wrap {
  position: absolute;
  /* width: 14px;
  height: 14px;
  right: 5%; */
  width: 48px;
  height: 48px;
  right: 1%;
}

@media (min-width: 376px) {
  .search-input {
    padding: 12px 45px 12px 52px;
  }
}
</style>
