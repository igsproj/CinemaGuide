<script setup lang="ts">
import LeftArrow from '@/components/icons/LeftArrowIcon.vue'

import FilmsList from '@/components/CardsGridListComp.vue'

import { loadFilm, isEmptyArray, setState, getErrorDlgData } from '@/lib/shared'
import type { ILoadRes } from '@/types/types'
import { ref, onUpdated } from 'vue'
import type { IFilm } from '@/lib/interfaces-rt.ts'

import { States } from '@/types/types'
import { useFilmsStore } from '@/stores/films'
import { useRouter } from 'vue-router'

const emits = defineEmits(['error', 'stateChanged'])

const props = defineProps({
  id: String
})

const films = useFilmsStore()
const router = useRouter()

const state = ref(States.new)

const allLoaded = ref(false)
const filmsByGenre = ref<IFilm[]>([])

const pageName = 'films'
const imgField = 'posterUrl'
const itemClass = 'item-film'
const gridClass = 'film-grid film-grid-list film-by-genres-grid'
const param = 'id'
const cardImage = 'film-image'
const srcId = 'filmsByGenre'

enum OpenBahavior {
  showFirstRecords,
  showAllLoadedRec
}

// Алгоритм что показываем при открытии жанра : первые 10 фильмов как в тз или все что было уже загружено в жанр
const onOpen: OpenBahavior = OpenBahavior.showFirstRecords
// const onOpen: OpenBahavior = OpenBahavior.showAllLoadedRec

const loadFilmsAmount = 50 // сколько будет отдавать backend за один запрос (не больше 50 за раз)
const addFilmsAmount = 10 // сколько фильмов будет добавляться на страницу при нажатии кнопки 'показать еще'
let scrollTo = 0

const filmsCnt = ref(0) // счетчик сколько всего фильмов сейчас на странице (кратно addFilmsAmount)

// page - начальная серверная страница, filter - текущий фильтр для страницы по полю жанр (245 последняя для horror). Данные добавляются один раз в хранилище, при первом вызове!
films.setData(props.id, { page: 0, loaded: [], filmsCnt: 0, curScrollPos: 0 }, true)

onUpdated(() => {
  let pos = 0
  if (filmsCnt.value !== addFilmsAmount) {
    pos = scrollTo > 0 ? scrollTo : document.body.scrollHeight
    scrollTo = 0
  }

  window.scrollTo({ left: 0, top: pos, behavior: 'instant' })
})

loadPageData()

/********************************************************
functions
********************************************************/
function nextRecords() {
  filmsCnt.value += addFilmsAmount
  films.getData(props.id).filmsCnt = filmsCnt.value

  filmsByGenre.value = films.getData(props.id).loaded.slice(0, filmsCnt.value)
}

async function _loadFilm(genre: string | undefined) {
  const flen = films.getData(props.id).loaded.length
  const fcnt = filmsCnt.value + addFilmsAmount

  if (flen > 0 && fcnt <= flen) {
    // берем фильмы из готового массива
    nextRecords()
    return { result: true }
  }

  let page = films.getData(genre).page
  const query = `movie/?genre=${genre}&page=${page}&count=${loadFilmsAmount}`

  setState(state, States.loading, emits, srcId)

  return await loadFilm(
    films,
    query,
    (resp: ILoadRes) => {
      const buf = films.getStore().getLoadBuf(resp.data) // получаем загруженный буфер
      buf.forEach((item) => films.getData(props.id).loaded.push(item)) // добавляем в хранилище
      films
        .getData(props.id)
        .loaded.sort((a: any, b: any) => Number(b.tmdbRating) - Number(a.tmdbRating)) // Сортировка хранилища по рейтингу по убыванию
      films.getStore().deleteLoadBuf(resp.data) // удаляем буфер

      ++films.getData(props.id).page // следующая загрузка с сервера будет с этой страницы

      nextRecords()
    },
    true // используем loadBuffer !
  )
}

async function loadMore() {
  const res = await _loadFilm(props.id)

  setState(state, States.done, emits, srcId)

  if (!res.result) {
    if (isEmptyArray(res.data)) {
      // пустой массив (в данном случае) значит, что больше нет данных
      allLoaded.value = true
    } else {
      // если это другая ошибка, покажем диалог
      emits('error', getErrorDlgData('Ошибка загрузки !'), srcId)
    }
  }
}

async function loadPageData() {
  if (!props.id) return

  const data = films.getData(props.id)

  function bh() {
    if (onOpen === OpenBahavior.showFirstRecords) return data.curScrollPos > 0
    if (onOpen === OpenBahavior.showAllLoadedRec) return data.curScrollPos >= 0
  }

  if (data.filmsCnt > 0 && bh()) {
    scrollTo = data.curScrollPos
    films.getData(props.id).curScrollPos = 0
    filmsCnt.value = data.filmsCnt - addFilmsAmount
  }

  const res = !(await _loadFilm(props.id)).result ? States.error : States.done
  setState(state, res, emits, srcId)
}

function clickBack() {
  router.push({ name: 'genres' })
}

function clickFilm() {
  if (props.id) films.getData(props.id).curScrollPos = window.scrollY
}
</script>

<template>
  <section v-if="state === States.done">
    <div class="container genres-films">
      <div class="page-title">
        <button class="flat-btn flex-row flex-align-center" @click="clickBack()">
          <LeftArrow />
          <span class="page-header">{{ props.id }}</span>
        </button>
      </div>

      <FilmsList
        class="genres-films-list"
        :items="filmsByGenre"
        :pageName="pageName"
        :imgField="imgField"
        :itemClass="itemClass"
        :gridClass="gridClass"
        :param="param"
        :cardImage="cardImage"
        @card-click="clickFilm()"
      />

      <div class="flex-row flex-justify-center" v-if="!allLoaded">
        <button class="flat-btn dlg-main-btn more-btn" @click="loadMore()">Показать еще</button>
      </div>
    </div>
  </section>
</template>

<style>
.genres-films {
  padding-bottom: 40px;
}

.genres-films-list {
  margin-bottom: 40px;
}

.more-btn {
  width: 100%;
}

.film-by-genres-grid {
  grid-auto-flow: row;
  height: auto;
  padding: 0;
}

@media (min-width: 400px) {
  .more-btn {
    width: fit-content;
  }

  .genres-films-list {
    margin-bottom: 64px;
  }
}

@media (min-width: 924px) {
  .genres-films {
    padding-bottom: 160px;
  }
}
</style>
