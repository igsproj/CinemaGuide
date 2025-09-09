<script setup lang="ts">
import ModalDlgComp from '@/components/ModalDlgComp.vue'

const emits = defineEmits([
  'closeRegisterDone',
  'openLogin'
])

const props = defineProps({
  show: Boolean,
  descr: String
})

const message = 'Регистрация завершена'
const buttons = [{ text: 'Войти', event: 'openLogin' }]
</script>

<template>
  <ModalDlgComp
    :message="message"
    :buttons="buttons"
    :show="props.show"
    :descr="props.descr"
    @close="() => emits('closeRegisterDone')"
    @openLogin="() => emits('openLogin')"
  >
  </ModalDlgComp>
</template>

<style></style>
