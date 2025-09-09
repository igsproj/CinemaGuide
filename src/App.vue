<script setup lang="ts">
import FooterComp from '@/components/FooterComp.vue'
import HeaderComp from '@/components/HeaderComp.vue'
import LoginComp from '@/components/LoginComp.vue'
import RegisterComp from '@/components/RegisterComp.vue'
import RegisterDoneComp from '@/components/RegisterDoneComp.vue'
import ModalErrDlg from '@/components/ModalDlgComp.vue'
import Loader from '@/components/LoaderComp.vue'
import VideoPlayer from '@/components/VideoPlayerComp.vue'

import type { IFilm, IErrorDlg } from '@/lib/interfaces-rt'
import { States } from '@/types/types'
import type { ILoadRes } from '@/types/types'

import {
  addFilms,
  clickOutside,
  loadFilm,
  sendUserData,
  modalAction,
  getErrorDlgData,
  getObjChild,
  callClassListFunc
} from '@/lib/shared'

import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'

import { useSession } from '@/stores/session'
import { useFilmsStore } from '@/stores/films'

const films = useFilmsStore()
const ses = useSession()
const router = useRouter()

const searchResults = ref<IFilm[]>([])
const dlgDescr = ref('')
const videoId = ref('')
const backgroundUrl = ref('')

const updateForm = ref(true)

const error = ref<IErrorDlg>({} as IErrorDlg)

const regDoneMsg = 'Используйте вашу электронную почту для входа'
const defaultErrMsg = 'Ошибка загрузки страницы'
let loaderErrMsg = ''

const modals = ref({
  login: {
    show: false,
    onOpen: () => {
      updateForm.value = true
      dlgDescr.value = ''
    }
  },
  register: {
    show: false,
    onOpen: () => {
      updateForm.value = true
      dlgDescr.value = ''
    }
  },
  registerDone: { show: false },
  error: { show: false },
  loader: { show: false },
  player: { show: false }
})

const routerViewState = ref(States.new)

onMounted(() => {
  window.addEventListener('click', clickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', clickOutside)
})

profileLoad() // попытка входа по сохраненной сессии

/********************************************************
functions
********************************************************/
function checkOnline() {
  if (!navigator.onLine) displayError(getErrorDlgData('Нет соединения. Проверьте сеть!'))

  return navigator.onLine
}

async function onSearch(ev: Event) {
  const val = (ev.target as HTMLInputElement).value

  if (!val.length) {
    onClearSearch()
    return
  }
  if (checkOnline()) await _loadFilm(val)
}

function onClearSearch() {
  searchResults.value = []
}

function showFormError(elem: HTMLElement, func: string) {
  callClassListFunc(elem, func, 'form-error') // установка / снятие рамки для input - аналог elem.classList[func]('form-error') для JS

  const img = getObjChild(elem, 'parentElement.lastElementChild', null) // установка цвета svg  - аналог elem.parentElement.lastElementChild.classList[func]('form-input-icon-error') для JS

  if (img) callClassListFunc(img, func, 'form-input-icon-error')
}

function onInputText(ev: Event) {
  updateForm.value = false
  dlgDescr.value = ''

  const form = (ev.target as HTMLInputElement).form

  if (form) for (let i = 0; i < form.length; ++i) showFormError(form[i] as HTMLElement, 'remove')
}

function checkForm(errDescr: string, data: HTMLElement) {
  updateForm.value = false
  dlgDescr.value = errDescr

  showFormError(data, 'add')
  data.focus()
}

function displayError(data: IErrorDlg) {
  error.value = data
  modalAction(modals.value, 'error', 'open')
}

function onPlayerError(data: IErrorDlg) {
  modalAction(modals.value, 'player', 'close')
  displayError(data)
}

async function playVideo(film: IFilm) {
  if (!checkOnline()) return

  await import('./lib/widget-api.js')

  videoId.value = film.trailerYouTubeId ?? ''
  backgroundUrl.value = film.backdropUrl ?? ''

  modalAction(modals.value, 'player', 'open')
}

async function processFav(id: string) {
  // на самом деле приходит id: number :)
  if (!ses.getLoggedIn()) {
    modalAction(modals.value, 'login', 'open')
    return
  }

  const film = films.getStore().getItem(id)
  const added = !film ? null : !film['inFav']

  const resp = await sendUserData(`favorites/${added ? '' : id}`, added ? { id: id } : null, {
    method: added ? 'POST' : 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'api-key': apiKey
    }
  })

  if (!resp.result) {
    ses.setLoggedIn(false) // возможно закончилась сессия
    router.push({ name: 'main' })
    displayError(getErrorDlgData('Ошибка обработки запроса!'))
    return
  }

  // теперь нужно добавить или удалить из списка fav
  if (film) film['inFav'] = !film['inFav']

  const index = films.getData('fav').value.findIndex((elem: IFilm) => elem.id === Number(id))

  if (added && index < 0) films.getData('fav').value.push(film)
  if (!added && index >= 0) films.getData('fav').value.splice(index, 1)
}

function updateFav() {
  films.getStore().walkSrc((id: string, film: IFilm) => {
    film.inFav = films.isInFav(id) ? true : false
  })
}

/*
Заморочки с профилем: Во время логина, пока грузится профиль пользователь может нажать
'добавить в избранное'. Чтобы избежать такого, нужно перед добавлением фильма ожидать полной загрузки профиля.
Для этого :

*1 - сначала устанавливаем films.setData('profile') в значение промиса от sendUserData. Функция
добавления в избранное будет ожидать его выполненния.

*2 - если профиль загружен, меняем films.setData('profile') на полученный объект

*3 В профиле приходит только массив из кодов фильмов. Но нам нужны сами фильмы. Поэтому получить просто профиль недостаточно.

*4 Для favorites нужно хранить данные как ref, чтобы обновлялся шаблон. Для остального ref не требуется, т.к. нет интеркативного удаления / добавления

*/
async function profileLoad() {
  films.setData('profile', sendUserData('profile', null, { method: 'GET' })) // *1

  const profile = await films.getData('profile')
  if (!profile.result) return false

  films.setData('profile', profile) // *2 теперь нужно заменить промис на данные

  // загрузить избранное (полная информация)
  const fav = await addFilms(films, 'favorites', true, { method: 'GET' }) // *3
  if (fav.result) {
    films.setData('fav', ref(films.getStore().getLoadBuf(fav.data).slice(0))) // *4
    films.getStore().deleteLoadBuf(fav.data)
  } else films.setData('fav', ref([]))

  ses.setLoggedIn(true)
  ses.setProfile(profile.data)

  // нужно обновить флаг "в избранном" для всех уже загруженных фильмов
  updateFav()

  return true
}

function logout() {
  ses.setLoggedIn(false)
  films.removeData('profile')
  films.removeData('fav')

  // нужно обновить favorites для всех уже загруженных фильмов
  updateFav()
}

async function login(data: HTMLFormElement) {
  const resp = await sendUserData(
    'auth/login',
    {
      email: (data.elements.namedItem('email') as HTMLInputElement).value,
      password: (data.elements.namedItem('password') as HTMLInputElement).value
    },
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        // 'api-key': apiKey
      }
    }
  )

  if (!resp.result) {
    dlgDescr.value = 'Ошибка авторизации'
    return
  }

  if (!(await profileLoad())) {
    dlgDescr.value = 'Ошибка загрузки профиля'
    return
  }

  modalAction(modals.value, 'login', 'close')
}

async function createAccount(data: HTMLFormElement) {
  const resp = await sendUserData(
    'user',
    {
      email: (data.elements.namedItem('email') as HTMLInputElement).value,
      password: (data.elements.namedItem('password') as HTMLInputElement).value,
      name: (data.elements.namedItem('name') as HTMLInputElement).value,
      surname: (data.elements.namedItem('surname') as HTMLInputElement).value
    },
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        // 'api-key': apiKey
      }
    }
  )

  if (!resp.result) {
    dlgDescr.value = 'Ошибка регистрации'
    return
  }

  modalAction(modals.value, 'register', 'close')
  modalAction(modals.value, 'registerDone', 'open')
}

async function _loadFilm(param: string) {
  return await loadFilm(
    films,
    `movie/?title=${param}&count=5`,
    (res: ILoadRes) => {
      searchResults.value = films.getStore().getLoadBuf(res.data).slice(0) as IFilm[]
      films.getStore().deleteLoadBuf(res.data)
    },
    true
  )
}
</script>

<template>
  <body>
    <header class="top-menu">
      <div class="container">
        <HeaderComp
          @login="modalAction(modals, 'login', 'open')"
          @search="(ev) => onSearch(ev)"
          @clearSearch="(ev: Event) => onClearSearch()"
          :searchResults="searchResults"
        />
      </div>
    </header>

    <main class="main-wrap">
      <!-- :key="$route.fullPath" : требуется для обновлений компонентов, когда меняется допустим параметр, но страница прежняя. -->
      <RouterView
        :key="$route.fullPath"
        @clickFav="(id: string) => processFav(id)"
        @logout="logout()"
        @error="(data: IErrorDlg) => displayError(data)"
        @playVideo="(film: IFilm) => playVideo(film)"
        @stateChanged="
          (state: States, srcId: string, msg: string) => {
            loaderErrMsg = msg ? msg : defaultErrMsg
            routerViewState = state
          }
        "
      />
      <Loader :state="routerViewState" :errMsg="loaderErrMsg" />
    </main>

    <!-- modals -->
    <LoginComp
      :show="modals.login.show"
      :descr="dlgDescr"
      :update="updateForm"
      @checkError="(errDescr: string, data: HTMLFormElement) => checkForm(errDescr, data)"
      @closeLogin="modalAction(modals, 'login', 'close')"
      @auth="(data) => login(data)"
      @openRegister="
        () => {
          modalAction(modals, 'login', 'close')
          modalAction(modals, 'register', 'open')
        }
      "
      @inputText="(ev: Event, srcId: string) => onInputText(ev)"
    />
    <RegisterComp
      :show="modals.register.show"
      :descr="dlgDescr"
      :update="updateForm"
      @checkError="(errDescr, data) => checkForm(errDescr, data)"
      @closeRegister="modalAction(modals, 'register', 'close')"
      @createAccount="(data) => createAccount(data)"
      @openLogin="
        () => {
          modalAction(modals, 'register', 'close')
          modalAction(modals, 'login', 'open')
        }
      "
      @inputText="(ev: Event, srcId: string) => onInputText(ev)"
    />
    <RegisterDoneComp
      :show="modals.registerDone.show"
      :descr="regDoneMsg"
      :update="true"
      @closeRegisterDone="modalAction(modals, 'registerDone', 'close')"
      @openLogin="
        () => {
          modalAction(modals, 'registerDone', 'close')
          modalAction(modals, 'login', 'open')
        }
      "
    />
    <ModalErrDlg
      :update="true"
      :show="modals.error.show"
      :buttons="error.buttons"
      :descr="error.descr"
      :disableCloseBtn="error.disableCloseBtn"
      @close="modalAction(modals, 'error', 'close')"
    />
    <VideoPlayer
      :show="modals.player.show"
      :videoId="videoId"
      :backgroundUrl="backgroundUrl"
      @error="(data) => onPlayerError(data)"
      @close="modalAction(modals, 'player', 'close')"
    />

    <footer>
      <div class="container">
        <FooterComp />
      </div>
    </footer>
  </body>
</template>

<style></style>
