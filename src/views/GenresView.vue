<script setup lang="ts">
import GenresList from '@/components/CardsGridListComp.vue'
import { loadData, getApiUrl, isWrongApiResponse, setState, imgApi } from '@/lib/shared'
import { ref } from 'vue'
import { States } from '@/types/types'
import { useFilmsStore } from '@/stores/films'

const emits = defineEmits(['error', 'stateChanged'])

const pageName = 'filmsByGenres'
const imgField = 'posterUrl'
const itemClass = 'genres-item'
const gridClass = 'genres-grid genres-grid-list'
const param = 'name'
const descrField = 'name'
const cardImage = 'genre-image'
const srcId = 'genres'

const films = useFilmsStore()
const state = ref(States.new)

if (films.getData('genres')) setState(state, States.done, emits, srcId)
else loadPageData()

/********************************************************
functions
********************************************************/
async function loadGenres() {
  const resp = await loadData(getApiUrl(`movie/genres`))

  if (isWrongApiResponse(resp) || !Array.isArray(resp)) return false

  films.setData(
    'genres',
    resp.map((item) => ({
      name: item,
      posterUrl: `${imgApi}/${item}.webp`
    }))
  )

  return true
}

async function loadPageData() {
  setState(state, States.loading, emits, srcId)
  const res = !(await loadGenres()) ? States.error : States.done
  setState(state, res, emits, srcId)
}
</script>

<template>
  <section v-if="state === States.done">
    <div class="container">
      <div class="page-title">
        <h1 class="page-header">Жанры фильмов</h1>
      </div>
      <GenresList
        class="genres-list"
        :items="films.getData('genres')"
        :pageName="pageName"
        :imgField="imgField"
        :itemClass="itemClass"
        :gridClass="gridClass"
        :param="param"
        :descrField="descrField"
        :cardImage="cardImage"
      />
    </div>
  </section>
</template>

<style></style>
