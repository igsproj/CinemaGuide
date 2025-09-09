<script setup lang="ts">
import LoginPassIcon from '@/components/icons/LoginPassIcon.vue'
import LoginMailIcon from '@/components/icons/LoginMailIcon.vue'

import ModalDlgComp from '@/components/ModalDlgComp.vue'
import { checkForm } from '@/lib/shared'

const emits = defineEmits(['closeLogin', 'auth', 'openRegister', 'inputText'])

const props = defineProps({
  show: Boolean,
  descr: String
})

const message = ''
const buttons = [
  { text: 'Войти', event: 'auth' },
  { text: 'Регистрация', event: 'openRegister' }
]

const srcId = 'LoginComp'

function formErrorCb(
  emitStr: 'inputText' | 'closeLogin' | 'auth' | 'openRegister',
  errDescr: string,
  elem: HTMLInputElement
) {
  emits(emitStr, errDescr, elem)
}

function formSuccessCb(data: HTMLFormElement) {
  emits('auth', data)
}
</script>

<!-- @auth="(data: HTMLFormElement) => emits('auth', data)" -->
<template>
  <ModalDlgComp
    :message="message"
    :buttons="buttons"
    :show="props.show"
    :descr="props.descr"
    @close="emits('closeLogin')"
    @auth="(data: HTMLFormElement) => checkForm(data, formErrorCb, formSuccessCb)"
    @openRegister="emits('openRegister')"
  >
    <div class="flex-column form-inputs">
      <div class="form-input-wrap">
        <input
          class="form-input"
          type="text"
          placeholder="Электронная почта"
          name="email"
          @input="(ev: Event) => emits('inputText', ev, srcId)"
        />
        <LoginMailIcon class="abs-y-center form-input-icon" />
      </div>
      <div class="form-input-wrap">
        <input
          class="form-input"
          type="password"
          placeholder="Пароль"
          name="password"
          @input="(ev: Event) => emits('inputText', ev, srcId)"
        />
        <LoginPassIcon class="abs-y-center form-input-icon" />
      </div>
    </div>
  </ModalDlgComp>
</template>

<style></style>
