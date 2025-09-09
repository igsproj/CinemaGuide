<script setup lang="ts">
import { loadFilm, setState, isValidStr } from '@/lib/shared'
import { ref, onMounted } from 'vue'
import type { ILoadRes } from '@/types/types'
import { States } from '@/types/types'
import { useFilmsStore } from '@/stores/films'
import { useRouter } from 'vue-router'

import FilmInfoDetails from '@/components/FilmInfoDetailsComp.vue'
import FilmInfoHeader from '@/components/FilmInfoHeader.vue'
import LeftArrow from '@/components/icons/LeftArrowIcon.vue'

const emits = defineEmits(['clickFav', 'error', 'stateChanged', 'playVideo'])

const props = defineProps({
  id: String
})

const films = useFilmsStore()
const router = useRouter()

let film = films.getStore().getItem(props.id)

const srcId = 'film'
const state = ref(States.new)
const bottomClass = 'bottom-class'
const headerButtons = 'film-header-buttons-auto'

onMounted(() => {
  // нужно для правильного показа если зашли в карточку из списка по жанрам (там возможен авто скроллинг)
  window.scrollTo({ left: 0, top: 0, behavior: 'instant' })
})

if (film) setState(state, States.done, emits, srcId)
else loadPageData(props.id)

/********************************************************
functions
********************************************************/
async function _loadFilm(id: string | undefined): Promise<ILoadRes> {
  return await loadFilm(films, `movie/${id}`, () => {
    film = films.getStore().getItem(id)
  })
}

async function loadPageData(id: string | undefined) {
  if (!isValidStr(id)) return

  setState(state, States.loading, emits, srcId)
  const res = !(await _loadFilm(id)).result ? States.error : States.done
  setState(state, res, emits, srcId)
}

function clickBack() {
  router.back()
}
</script>

<template>
  <section class="film-header-sect" v-if="state === States.done">
    <div class="container">
      <div class="page-title">
        <button class="flat-btn flex-row flex-align-center" @click="clickBack()">
          <LeftArrow />
          <span class="page-header">Назад</span>
        </button>
      </div>
      <FilmInfoHeader
        :film="film"
        :addedToFav="film ? film.inFav : false"
        :bigSize="true"
        :bottomClass="bottomClass"
        :headerButtons="headerButtons"
        @playVideo="(film) => emits('playVideo', film, srcId)"
        @clickFav="(id) => emits('clickFav', id, srcId)"
      />
    </div>
  </section>
  <section class="film-details-sect" v-if="state === States.done">
    <div class="container">
      <FilmInfoDetails :film="film" />
    </div>
  </section>
</template>

<style>
.bottom-class {
  flex-wrap: nowrap;
}

.film-details-sect {
  padding-bottom: 20px;
}

@media (min-width: 550px) {
  .film-details-sect {
    padding-bottom: 120px;
  }
}
</style>
