<script setup lang="ts">
import RefreshIcon from '@/components/icons/RefreshIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import HeartFavIcon from '@/components/icons/HeartFavIcon.vue'
import FilmHeaderComp from '@/components/FilmHeaderComp.vue'

import { getProp } from '@/lib/shared'
import { RouterLink } from 'vue-router'
import { ref, computed } from 'vue'

const props = defineProps({
  film: Object,
  mainPage: Boolean,
  stopRefresh: Boolean,
  addedToFav: Boolean,
  bigSize: Boolean,
  addPaddingTop: Boolean,
  bottomClass: String,
  headerButtons: String
})

const emits = defineEmits(['refresh', 'clickFav', 'playVideo'])
const startRefresh = ref(false)

const rotatingClass = computed(() => ({
  rotating: startRefresh.value === true && !props.stopRefresh
}))

function onRefreshClick() {
  emits('refresh')
  startRefresh.value = true
}

const addPaddingTop = computed(() => ({
  'padding-top': props.addPaddingTop
}))
</script>
<!-- film-header-btn film-header-trailer -->
<template>
  <div class="film-header-wrap" :class="addPaddingTop">
    <img :src="getProp(props.film, 'backdropUrl')" class="img-auto film-img" />

    <div class="flex-column film-header-info">
      <FilmHeaderComp :film="props.film" :bigSize="props.bigSize" />

      <div class="flex-row cg-16 rg-16" :class="props.bottomClass">
        <button class="film-header-btn film-header-trailer" @click="emits('playVideo', props.film)">
          Трейлер
        </button>

        <div class="flex-row film-header-buttons" :class="props.headerButtons">
          <RouterLink
            class="film-header-btn film-header-about"
            :to="{ name: 'films', params: { id: getProp(props.film, 'id') } }"
            v-if="props.mainPage"
          >
            О&nbsp;фильме
          </RouterLink>
          <button
            class="film-header-icon-btn"
            @click="emits('clickFav', getProp(props.film, 'id'))"
          >
            <HeartIcon class="film-header-icon-svg" v-if="!props.addedToFav" />
            <HeartFavIcon class="film-header-icon-svg" v-else />
          </button>
          <button class="film-header-icon-btn" v-if="props.mainPage" @click="onRefreshClick()">
            <RefreshIcon class="film-header-icon-svg" :class="rotatingClass" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* .film-header-btn {
  color: var(--palette-col4);
} */
.film-header-btn {
  padding: 16px 40px;
  border-radius: 28px;
  color: var(--palette-col4);

  font-family: 'Play';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
}

.film-header-trailer {
  background-color: var(--palette-col5);
}

.film-header-about {
  background-color: var(--palette-col2);
  border: 1px solid var(--palette-col8);
}

.film-header-icon-svg {
  width: 24px;
  height: 24px;
}

.film-header-icon-btn {
  padding: 0;
  border-radius: 28px;
  width: 68px;
  height: 56px;
  background: var(--palette-col13);
  border: 1px solid var(--palette-col8);
}

.padding-top {
  padding-top: 106px;
}

.film-header-title {
  color: var(--palette-col4);
}

.film-header-bottom {
  flex-wrap: wrap;
}

.film-header-top {
  row-gap: 16px;
}

.film-header-descr {
  font-size: 24px;
  line-height: 32px;
  color: var(--palette-col7);
}

.film-header-bkg {
  background-position: top;
  background-size: 100%;
  background-repeat: no-repeat;
}

.film-header-info {
  row-gap: 32px;
  width: auto;
  height: fit-content;
  justify-content: space-between;
}

.film-header-trailer {
  width: 100%;
}

.film-header-buttons {
  row-gap: 12px;
  column-gap: 12px;
  justify-content: space-between;
  width: 100%;
}

.film-header-buttons-auto {
  width: auto;
}

.film-img {
  margin-bottom: 24px;
}

@media (min-width: 395px) {
  .film-header-trailer {
    width: auto;
  }

  .film-header-btn {
    padding: 16px 48px;
  }

  .film-header-buttons {
    row-gap: 16px;
    column-gap: 16px;
    justify-content: start;
  }

  .film-header-buttons-auto {
    width: 100%;
  }
}

@media (min-width: 610px) {
  .film-header-bottom {
    flex-wrap: nowrap;
  }
}

@media (min-width: 1280px) {
  .film-header-wrap {
    min-height: 584px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    column-gap: 20px;
  }

  .film-img {
    width: 58%;
    height: 32.76%;
    margin-bottom: 0;
  }

  .film-header-info {
    row-gap: 60px;
    width: 44%;
    align-self: center;
  }

  .film-header-big {
    row-gap: 16px;
  }

  .film-header-bottom {
    flex-wrap: wrap;
  }

  .film-header-info {
    width: 44%;
  }

  .film-header-bkg {
    background-size: 55%;
  }
}

@media (min-width: 1300px) {
  .film-header-bottom {
    flex-wrap: nowrap;
  }
}
</style>
