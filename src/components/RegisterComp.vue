<script setup lang="ts">
import LoginPassIcon from '@/components/icons/LoginPassIcon.vue'
import LoginMailIcon from '@/components/icons/LoginMailIcon.vue'
import UserIcon from '@/components/icons/UserBlackIcon.vue'

import ModalDlgComp from '@/components/ModalDlgComp.vue'

import { checkForm } from '@/lib/shared'

const emits = defineEmits([
  'closeRegister',
  'openLogin',
  'createAccount',
  'inputText',
  'checkError'
])

const props = defineProps({
  show: Boolean,
  descr: String
})

const message = 'Регистрация'
const buttons = [
  { text: 'Создать аккаунт', event: 'createAccount' },
  { text: 'У меня есть пароль', event: 'openLogin' }
]

const srcId = 'RegisterComp'

function formErrorCb(
  emitStr: 'inputText' | 'checkError' | 'closeRegister' | 'openLogin' | 'createAccount',
  errDescr: string,
  elem: HTMLInputElement
) {
  emits(emitStr, errDescr, elem)
}

function formSuccessCb(data: HTMLFormElement) {
  emits('createAccount', data)
}
</script>

<template>
  <ModalDlgComp
    :message="message"
    :descr="props.descr"
    :buttons="buttons"
    :show="props.show"
    @close="() => emits('closeRegister')"
    @createAccount="(data: HTMLFormElement) => checkForm(data, formErrorCb, formSuccessCb)"
    @openLogin="() => emits('openLogin')"
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
          type="text"
          placeholder="Имя"
          name="name"
          @input="(ev: Event) => emits('inputText', ev, srcId)"
        />
        <UserIcon class="abs-y-center form-input-icon" />
      </div>
      <div class="form-input-wrap">
        <input
          class="form-input"
          type="text"
          placeholder="Фамилия"
          name="surname"
          @input="(ev: Event) => emits('inputText', ev, srcId)"
        />
        <UserIcon class="abs-y-center form-input-icon" />
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
      <div class="form-input-wrap">
        <input
          class="form-input"
          type="password"
          placeholder="Подтвердить пароль"
          name="passconfirm"
          @input="(ev: Event) => emits('inputText', ev, srcId)"
        />
        <LoginPassIcon class="abs-y-center form-input-icon" />
      </div>
    </div>
  </ModalDlgComp>
</template>

<style></style>
