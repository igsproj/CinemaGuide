<script setup lang="ts">
import { delay, loadFilm, getErrorDlgData } from '@/lib/shared'
import { ref } from 'vue'
import { States } from '@/types/types'
import type { ILoadRes } from '@/types/types'
import { useFilmsStore } from '@/stores/films'
import TopFilms from '@/components/CardsGridListComp.vue'
import FilmInfoHeader from '@/components/FilmInfoHeader.vue'
import { setState } from '@/lib/shared'

const emits = defineEmits(['clickFav', 'error', 'stateChanged', 'playVideo'])
const films = useFilmsStore()

const stopRefresh = ref(true)
const refreshMsec = 500

// данные для grid
const pageName = 'films'
const imgField = 'posterUrl'
const itemClass = 'item-film'
const gridClass = 'film-grid film-grid-list'
const param = 'id'
const cardImage = 'film-image'

const srcId = 'main'
const state = ref(States.new)
const bottomClass = 'film-header-bottom'

if (films.getData('random') && films.getData('top10')) setState(state, States.done, emits, srcId)
else loadPageData()

/********************************************************
functions
********************************************************/
async function _loadFilm(param: string) {
  return await loadFilm(
    films,
    `movie/${param}`,
    (res: ILoadRes) => {
      films.setData(param, films.getStore().getLoadBuf(res.data)) // data будет хранить ссылку на загруженный буфер - копирования здесь нет !
    },
    true
  )
}

async function refreshRandom() {
  stopRefresh.value = false
  if (!(await _loadFilm('random')).result)
    emits('error', getErrorDlgData('Ошибка загрузки случайного фильма!'), srcId)

  await delay(refreshMsec) // дадим повращаться
  stopRefresh.value = true
}

async function loadPageData() {
  setState(state, States.loading, emits, srcId)
  const res =
    !(await _loadFilm('top10')).result || !(await _loadFilm('random')).result
      ? States.error
      : States.done
  setState(state, res, emits, srcId)
}
</script>

<!-- @error="(data) => emits('error', data, emits)" -->
<template>
  <section v-if="state === States.done">
    <div class="container film-info">
      <FilmInfoHeader
        :film="films.getData('random')[0]"
        :bigSize="true"
        :mainPage="true"
        :stopRefresh="stopRefresh"
        :addedToFav="films.getData('random')[0].inFav"
        :bottomClass="bottomClass"
        @refresh="refreshRandom()"
        @clickFav="emits('clickFav', films.getData('random')[0].id, emits)"
        @playVideo="(film) => emits('playVideo', film, emits)"
      />
    </div>
  </section>

  <section v-if="state === States.done">
    <div class="top10-films">
      <h2 class="container film-title">Топ 10 фильмов</h2>
      <TopFilms
        class="container"
        :items="films.getData('top10')"
        :pageName="pageName"
        :imgField="imgField"
        :itemClass="itemClass"
        :gridClass="gridClass"
        :param="param"
        :show-numbers="true"
        :cardImage="cardImage"
      />
    </div>
  </section>
</template>

<style>
@media (min-width: 924px) {
  .top10-films {
    padding-bottom: 120px;
  }
}
</style>
