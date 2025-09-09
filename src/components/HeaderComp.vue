<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useSession } from '@/stores/session'

import SearchInput from '@/components/SearchComp.vue'
import SearchResults from '@/components/SearchResultsComp.vue'

import SearchIcon from '@/components/icons/SearchIcon.vue'
import AccountIcon from '@/components/icons/AccountIcon.vue'
import GenresIcon from '@/components/icons/GenresIcon.vue'

import { ref, watch } from 'vue'

import { addClickCb, removeClickCb, createInstId, createUniqId } from '@/lib/shared'
import { onMounted, onUnmounted } from 'vue'

let instId: number = 0
const searchHidePx = 650

const ses = useSession()
const emits = defineEmits(['login', 'search', 'clearSearch', 'logout'])

const props = defineProps({
  searchResults: Object
})

const showSearch = ref(true)
const setSearchFocus = ref(false)
const showLogo = ref(true)
const showGenres = ref(true)
const showAccount = ref(true)
const showSearchButton = ref(true)

const resetInput = ref(false)

const clearVisibleAlways = ref(isMobileSearch())

const pageName = 'films'
const inputDebounce = 500 // ms

let lastWindowWidth = window.innerWidth

let searchStr = ''
showSearch.value = !isMobileSearch()

onMounted(() => {
  // instId = createUniqId()
  // addClickCb({ id: instId, func: clickOutside })

  addEventListener('resize', onResizeEvent)
})

onUnmounted(() => {
  removeClickCb(instId)
  removeEventListener('resize', onResizeEvent)
})

watch(showSearch, () => {
  // console.log('watch', showSearch.value)

  if (isMobileSearch()) searchTrigger()
  else setSearchFocus.value = false
})

function loginClick() {
  if (ses.getLoggedIn()) emits('logout')
  else emits('login')
}

function searchTrigger(cond?: boolean) {
  const val = cond === true || cond === false ? true : false

  showLogo.value = val ? cond : !showSearch.value
  showGenres.value = val ? cond : !showSearch.value
  showAccount.value = val ? cond : !showSearch.value
  showSearchButton.value = val ? cond : !showSearch.value
}

function isMobileSearch(res?: number) {
  if (res) return res < searchHidePx

  return window.innerWidth < searchHidePx
}

function searchClick(ev: Event) {
  // if (ev) ev._instId = createInstId(instId, 'searchButton')

  showSearch.value = true //!showSearch.value
  setSearchFocus.value = true
}

// function clickOutside(ev: Event) {
//   const curClick = ev.target.parentElement ? ev.target.parentElement.getAttribute('name') : ''

//   if (
//     isMobileSearch() &&
//     ev._instId !== createInstId(instId, 'searchButton') &&
//     ev._instId !== createInstId(instId, curClick) &&
//     showSearch.value
//   ) {
//     showSearch.value = false
//   }
// }

function clearSearchResults() {
  emits('clearSearch')
  resetInput.value = false
  searchStr = ''

  if (isMobileSearch()) showSearch.value = false
}

function followSearchResult() {
  resetInput.value = true
}

async function onInputText(ev: Event) {
  searchStr = ev.target.value

  if (searchStr.length) emits('search', ev)
  else emits('clearSearch')
}

function onResizeEvent() {
  // console.log(
  //   'is mobile =' + isMobileSearch(),
  //   'prev is mobile =' + isMobileSearch(lastWindowWidth),
  //   'prev w =' + lastWindowWidth,
  //   'cur w =' + window.innerWidth
  // )

  if (!isMobileSearch()) showSearch.value = true

  if (!isMobileSearch() && isMobileSearch(lastWindowWidth)) searchTrigger(true)

  if (isMobileSearch() && !isMobileSearch(lastWindowWidth)) {
    showSearch.value = Boolean(searchStr.length)
    searchTrigger(false)
  }

  clearVisibleAlways.value = isMobileSearch()
  lastWindowWidth = window.innerWidth
}
</script>

<template>
  <nav class="flex-row flex-align-center flex-justify-spb nav-wrap">
    <RouterLink class="logo-wrap" to="/" v-if="showLogo">
      <img class="logo" src="@/assets/img/logo.svg" alt="" />
    </RouterLink>

    <div class="flex-row flex-align-center flex-justify-end main-menu">
      <RouterLink
        class="header-link main-link"
        to="/"
        activeClass="header-link-active"
        exactActiveClass="header-link-exactive"
      >
        <span class="header-link-text">Главная</span>
      </RouterLink>

      <RouterLink
        class="header-link genres-link"
        to="/genres"
        v-if="showGenres"
        activeClass="header-link-active"
        exactActiveClass="header-link-exactive"
      >
        <span class="header-link-text genres-text">Жанры</span>
        <GenresIcon class="header-icons genres-icon" />
      </RouterLink>

      <div class="search-input-wrap" v-if="showSearch">
        <SearchInput
          class=""
          :setFocus="setSearchFocus"
          :resetInput="resetInput"
          :inputDebounce="inputDebounce"
          :clearVisibleAlways="clearVisibleAlways"
          @click="
            (ev: Event) => {
              // ev._instId = createInstId(instId, 'searchInput')
            }
          "
          @inputText="(ev: Event) => onInputText(ev)"
          @clearText="(ev: Event) => clearSearchResults()"
        />
        <SearchResults
          :items="props.searchResults"
          :pageName="pageName"
          @resultClick="(ev: Event) => followSearchResult()"
        />
      </div>

      <button
        class="flat-btn search-btn"
        @click="(ev: Event) => searchClick(ev)"
        v-if="showSearchButton"
      >
        <SearchIcon class="header-icons" />
      </button>

      <button
        class="flat-btn login-btn"
        @click="loginClick()"
        v-if="!ses.getLoggedIn() && showAccount"
      >
        <span class="header-link-text login-text">Войти</span>
        <AccountIcon class="header-icons login-icon" />
      </button>
      <RouterLink
        class="header-link"
        to="/account"
        v-if="ses.getLoggedIn() && showAccount"
        activeClass="header-link-active"
        exactActiveClass="header-link-exactive"
      >
        <span class="header-link-text account-text">{{ ses.getProfile().name }}</span>
        <AccountIcon class="header-icons login-icon" />
      </RouterLink>
    </div>
  </nav>
</template>

<style>
.logo-wrap {
  line-height: 0;
}

.nav-wrap {
  column-gap: 40px;
}

.main-menu {
  flex-basis: 100%;
  column-gap: 20px;
}

.header-link {
  position: relative;
}

.header-link-text {
  color: var(--palette-col4);
  font-family: 'Play';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
}

.genres-icon {
  display: block;
}

.genres-text {
  display: none;
}

.search-input-wrap {
  width: 100%;
  position: relative;
}

.main-link {
  display: none;
}

.login-text {
  display: none;
  color: var(--palette-col4);
}

.login-icon {
  display: block;
}

.search-btn {
  display: block;
  height: 24px;
}

.header-icons {
  width: 24px;
  height: 24px;
}

.account-text {
  display: none;
}

@media (min-width: 650px) {
  .search-input-wrap {
    display: block;
    flex-basis: 70%;
  }

  .search-btn {
    display: none;
  }

  .main-menu {
    flex-basis: 73%;
  }
}

@media (min-width: 990px) {
  .search-input-wrap {
    flex-basis: 60%;
  }

  .main-menu {
    column-gap: 40px;
  }

  .account-text {
    display: block;
  }

  .login-text {
    display: block;
  }

  .login-icon {
    display: none;
  }

  .genres-icon {
    display: none;
  }

  .genres-text {
    display: block;
  }

  .main-link {
    display: block;
  }

  .header-link-active::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -7px;
    height: 2px;
    background-color: var(--palette-col14);
    opacity: 1;
  }
}
</style>
