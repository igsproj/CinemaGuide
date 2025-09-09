<script setup lang="ts">
import HeartIcon from '@/components/icons/HeartIcon.vue'
import UserIcon from '@/components/icons/UserWhiteIcon.vue'
import MailIcon from '@/components/icons/MailIcon.vue'
import Favorites from '@/components/CardsGridListComp.vue'

import { useRouter } from 'vue-router'
import { useSession } from '@/stores/session'
import { useFilmsStore } from '@/stores/films'
import { ref, onMounted, onUnmounted } from 'vue'
import { tabSelect, sendUserData, getErrorDlgData } from '@/lib/shared'

const emits = defineEmits(['logout', 'clickFav', 'error'])

const ses = useSession()
const films = useFilmsStore()
const router = useRouter()

const tabs = ref({
  selectedFilms: { show: true },
  accSettings: { show: false }
})

const selectedDescr = ref('')
const settingsDescr = ref('')

const pageName = 'films'
const imgField = 'posterUrl'
const itemClass = 'item-film item-fav-film'
const gridClass = 'film-grid film-grid-list'
const param = 'id'
const cardImage = 'film-image'
const srcId = 'account'

onMounted(() => {
  addEventListener('resize', onResizeEvent)
  onResizeEvent()
})

onUnmounted(() => {
  removeEventListener('resize', onResizeEvent)
})

if (!ses.getLoggedIn()) router.push({ name: 'main' })

const fav = films.getData('fav')

/********************************************************
functions
********************************************************/
async function onLogout() {
  const resp = await sendUserData('auth/logout', null, { method: 'GET' })

  if (!resp.result) {
    emits('error', getErrorDlgData('Ошибка выхода!'), srcId)
    return
  }

  router.push({ name: 'main' })
  emits('logout')
}

function getUserAvatar() {
  return (ses.getProfile().name[0] ?? '' + ses.getProfile().surname[0]).toUpperCase() ?? ''
}

function onResizeEvent() {
  if (window.innerWidth >= 680) {
    selectedDescr.value = 'Избранные фильмы'
    settingsDescr.value = 'Настройки аккаунта'
  } else {
    selectedDescr.value = 'Избранное'
    settingsDescr.value = 'Настройки'
  }
}
</script>

<template>
  <section>
    <div class="container">
      <div class="page-title">
        <h1 class="page-header">Мой аккаунт</h1>
      </div>

      <div class="flex-row acc-tabs">
        <button
          class="flat-btn flex-row flex-align-center acc-tab"
          @click="tabSelect(tabs, 'selectedFilms')"
        >
          <HeartIcon class="acc-tab-icon" />
          <span class="acc-tab-descr">{{ selectedDescr }}</span>
          <div :class="{ 'acc-tab-active': tabs.selectedFilms.show }"></div>
        </button>

        <button
          class="flat-btn flex-row flex-align-center acc-tab"
          @click="tabSelect(tabs, 'accSettings')"
        >
          <UserIcon class="acc-tab-icon" />
          <span class="acc-tab-descr">{{ settingsDescr }}</span>
          <div :class="{ 'acc-tab-active': tabs.accSettings.show }"></div>
        </button>
      </div>
    </div>

    <div class="acc-tab-content">
      <div class="top10-films" v-if="tabs.selectedFilms.show">
        <Favorites
          class="films-fav-grid container"
          :items="fav"
          :pageName="pageName"
          :imgField="imgField"
          :itemClass="itemClass"
          :gridClass="gridClass"
          :param="param"
          :showDelete="true"
          :cardImage="cardImage"
          @clickFav="(id: string) => emits('clickFav', id)"
        />
      </div>
      <div class="flex-column container" v-if="tabs.accSettings.show">
        <div class="acc-settings-wrap">
          <div class="flex-row acc-settings-name-wrap">
            <div class="round acc-icon-wrap">
              <span class="acc-icon-content abs-xy-center avatar">{{ getUserAvatar() }}</span>
            </div>
            <div class="flex-column flex-justify-spb">
              <span class="data-label">Имя Фамилия</span>
              <span class="data-text">{{
                ses.getProfile().name ?? '' + ' ' + ses.getProfile().surname ?? ''
              }}</span>
            </div>
          </div>
          <div class="flex-row acc-settings-email-wrap">
            <div class="round acc-icon-wrap">
              <MailIcon class="acc-icon-content abs-xy-center" />
            </div>
            <div class="flex-column flex-justify-spb">
              <span class="data-label">Электронная почта</span>
              <span class="data-text">{{ ses.getProfile().email ?? '' }}</span>
            </div>
          </div>
        </div>
        <button class="dlg-main-btn acc-settings-logout" @click="onLogout()">
          Выйти из аккаунта
        </button>
      </div>
    </div>
  </section>
</template>

<style>
.item-fav-film {
  transition: border-color 0.3s linear;
}

.delete-film {
  width: 40px;
  height: 40px;
  position: absolute;
  z-index: 10;
  right: -17px;
  top: -24px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s linear;
}

.acc-tab-icon {
  width: 24px;
  height: 24px;
}

.acc-icon-wrap {
  position: relative;
}

.acc-icon-content {
  position: absolute;
}

.data-label {
  color: var(--palette-col12);
  font-family: 'Play';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}

.data-text {
  color: var(--palette-col4);
  font-family: 'Play';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
}

.avatar {
  color: var(--palette-col4);
  font-family: 'Play';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
}

.round {
  width: 60px;
  height: 60px;
  background-color: var(--palette-col16);
  border-radius: 100%;
}

.acc-tabs {
  column-gap: 24px;
}

.acc-tab {
  position: relative;
  column-gap: 4px;
}

.acc-tab-active {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -7px;
  height: 2px;
  background-color: var(--palette-col14);
  opacity: 1;
}

.acc-tab-descr {
  color: var(--palette-col4);

  font-family: 'Play';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 18px;
}

.acc-settings-wrap {
  padding-top: 40px;
  padding-bottom: 40px;
}

.acc-settings-name-wrap {
  margin-bottom: 40px;
  column-gap: 16px;
  color: var(--palette-col4);
}

.acc-settings-email-wrap {
  column-gap: 16px;
  color: var(--palette-col4);
}

.acc-settings-logout {
  width: 100%;
}

@media (min-width: 375px) {
  .acc-tab-descr {
    font-size: 24px;
    line-height: 32px;
  }
}

@media (min-width: 400px) {
  .acc-settings-logout {
    width: fit-content;
  }

  .acc-settings-wrap {
    padding-top: 64px;
    padding-bottom: 64px;
  }
}

@media (min-width: 550px) {
  .selected-films {
    padding-bottom: 120px;
  }

  .acc-tabs {
    column-gap: 64px;
  }

  .data-label {
    color: var(--palette-col4);
    font-size: 18px;
    line-height: 24px;
  }

  .data-text {
    font-size: 24px;
    line-height: 32px;
  }

  .films-fav-grid {
    padding-top: 64px;
  }
}

@media (min-width: 1200px) {
  .grid-list-item:hover .delete-film {
    visibility: visible;
    opacity: 1;
  }

  .item-fav-film:hover {
    border-color: var(--palette-col4);
  }
}
</style>
