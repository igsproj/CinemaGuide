<script setup lang="ts">
import GradeBullshitIcon from '@/components/icons/GradeBullshitIcon.vue'
import GradePoorIcon from '@/components/icons/GradePoorIcon.vue'
import GradeGoodIcon from '@/components/icons/GradeGoodIcon.vue'
import GradeExcellentIcon from '@/components/icons/GradeExcellentIcon.vue'

import { computed } from 'vue'

import { getShotDescr, getFilmLength, getObjChild } from '@/lib/shared'

const props = defineProps({
  film: Object,
  hideTitle: Boolean,
  hideDescr: Boolean,
  titleClass: String,
  bigSize: Boolean
})

function getRating() {
  let rate = Number(getRatingValue())

  return rate % 1 === 0 ? rate : rate.toFixed(1)
}

const raitingClass = computed(() => ({
  'grade-icon-big': props.bigSize,
  'grade-icon-sm': !props.bigSize
}))

const filmHeaderClass = computed(() => ({
  'film-header-big': props.bigSize,
  'film-header-sm': !props.bigSize
}))

const columnGap = computed(() => ({
  'col-gap-big': props.bigSize,
  'col-gap-sm': !props.bigSize
}))

const gradeText = computed(() => ({
  'grade-text-big': props.bigSize,
  'grade-text-sm': !props.bigSize
}))

const filmInfo = computed(() => ({
  'film-details-bg': props.bigSize,
  'film-details-sm': !props.bigSize
}))

function getRatingValue() {
  return getObjChild(props, 'film.tmdbRating', 0)
}
</script>

<template>
  <div class="flex-column" :class="filmHeaderClass">
    <div class="flex-row flex-align-center rating-wrap" :class="columnGap">
      <div class="grade-icon-wrap" :class="raitingClass">
        <GradeBullshitIcon :class="raitingClass" v-if="getRatingValue() <= 5" />
        <GradePoorIcon
          :class="raitingClass"
          v-if="getRatingValue() > 5 && getRatingValue() <= 6.5"
        />
        <GradeGoodIcon
          :class="raitingClass"
          v-if="getRatingValue() > 6.5 && getRatingValue() <= 8"
        />
        <GradeExcellentIcon class="grade-icon" v-if="getRatingValue() > 8" />
        <span class="grade-icon-text abs-y-center" :class="gradeText">{{ getRating() }}</span>
      </div>
      <span :class="filmInfo">{{ getObjChild(props, 'film.releaseYear', '') }}</span>
      <span :class="filmInfo">{{ getObjChild(props, 'film.genres', '').join(' ') }}</span>
      <span class="nobr" :class="filmInfo">{{
        getFilmLength(getObjChild(props, 'film.runtime', ''))
      }}</span>
    </div>
    <h1 class="page-header" :class="props.titleClass" v-if="!props.hideTitle && props.bigSize">
      {{ getObjChild(props, 'film.title', '') }}
    </h1>
    <p
      class="film-header-title-p"
      :class="props.titleClass"
      v-if="!props.hideTitle && !props.bigSize"
    >
      {{ getObjChild(props, 'film.title', '') }}
    </p>
    <p class="film-header-descr" v-if="!props.hideDescr">
      {{ getShotDescr(getObjChild(props, 'film.plot', '')) }}
    </p>
  </div>
</template>

<style>
.rating-wrap {
  flex-wrap: wrap;
}

.grade-icon-wrap {
  position: relative;
}

.grade-icon-big {
  width: 70px;
  height: 32px;
}

.grade-icon-sm {
  width: 47px;
  height: 20px;
}

.grade-icon-text {
  position: absolute;
  color: white;
  left: 45%;

  font-family: 'Play';
  font-style: normal;
}

.grade-text-big {
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
}

.grade-text-sm {
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
}

.film-header-big {
  row-gap: 12px;
}

.film-header-sm {
  row-gap: 8px;
}

.col-gap-big {
  column-gap: 16px;
  row-gap: 8px;
}

.col-gap-sm {
  column-gap: 8px;
}

.film-header-descr {
  font-family: 'Play';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 32px;
  color: var(--palette-col7);
}

.film-header-title-p {
  font-family: 'Play';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: var(--palette-col4);
}

.film-details-bg {
  font-family: 'Play';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: var(--palette-col7);
}

.film-details-sm {
  font-family: 'Play';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--palette-col7);
}

@media (min-width: 400px) {
  .film-details-bg {
    font-size: 18px;
  }

  .film-header-descr {
    font-size: 24px;
  }
}

@media (min-width: 500px) {
  .rating-wrap {
    justify-content: flex-start;
  }
}
</style>
