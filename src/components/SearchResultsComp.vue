<script setup lang="ts">
import FilmHeaderComp from '@/components/FilmHeaderComp.vue'

const props = defineProps({
  items: Object,
  pageName: String
})

const emits = defineEmits(['resultClick'])

const titleClass = 'header-title'

function show() {
  if (!props.items) return false

  return props.items.length
}
</script>

<template>
  <ul class="list-reset search-results" v-if="show()">
    <li class="search-results-item" v-for="item in props.items" :key="item.id">
      <RouterLink
        :to="{ name: props.pageName, params: { id: item.id } }"
        @click="emits('resultClick')"
      >
        <div class="search-results-row">
          <img :src="item.posterUrl" alt="" class="mini-poster" />
          <FilmHeaderComp :film="item" :hideDescr="true" :titleClass="titleClass" />
        </div>
      </RouterLink>
    </li>
  </ul>
</template>

<style>
.header-title {
  font-size: 18px;
}

.mini-poster {
  width: 158px;
  height: 206px;
  margin-bottom: 16px;
}

.search-results {
  display: flex;
  flex-direction: row;
  column-gap: 16px;

  position: absolute;
  top: 110%;
  padding: 20px 24px;
  overflow: auto;
  background: var(--palette-col2);

  width: 100%;
  transform: none;

  right: 0;
}

.search-results-row {
  display: flex;
  flex-direction: column;
  column-gap: 16px;
  padding: 0;
  width: 220px;
}

.search-results-item {
  padding: 0;
  width: 220px;
}

@media (min-width: 376px) {
  .search-results {
    flex-direction: column;
    padding: 8px;
  }

  .search-results-row {
    width: auto;
    flex-direction: row;
    padding: 20px 8px;
  }

  .mini-poster {
    width: 40px;
    height: 52px;
    margin-bottom: 0;
  }

  .search-results-item {
    width: auto;
  }
}

@media (min-width: 650px) {
  .search-results {
    top: 132%;
    width: 145%;
    transform: translateX(15%);
  }
}

@media (min-width: 840px) {
  .search-results {
    width: 100%;
    transform: none;
  }
}

@media (min-width: 990px) {
  .search-results {
    width: 165%;
    transform: translateX(20%);
  }
}

@media (min-width: 1075px) {
  .search-results {
    width: 145%;
    transform: translateX(15%);
  }
}

@media (min-width: 1150px) {
  .search-results {
    width: 100%;
    transform: none;
  }
}

@media (min-width: 1200px) {
  .search-results-row:hover {
    border: 1px solid var(--palette-col12);
    border-radius: 6px;
  }
}
</style>
