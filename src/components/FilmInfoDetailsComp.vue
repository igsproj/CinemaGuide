<script setup lang="ts">
import { showField, getProp } from '@/lib/shared'

const props = defineProps({
  film: Object
})
</script>

<template>
  <h2 class="film-title">О фильме</h2>

  <ul class="list-reset flex-column film-details-items">
    <li class="film-details-item">
      <div class="flex-row film-details-item-left">
        <span class="nobr film-award-category"> Язык оригинала </span>
        <div class="dots"></div>
      </div>
      <span class="film-award-value">{{ showField(getProp(props.film, 'language')) }}</span>
    </li>
    <li class="film-details-item">
      <div class="flex-row film-details-item-left">
        <span class="nobr film-award-category"> Бюджет </span>
        <div class="dots"></div>
      </div>
      <span class="film-award-value">{{ showField(getProp(props.film, 'budget')) }}</span>
    </li>
    <li class="film-details-item">
      <div class="flex-row film-details-item-left">
        <span class="nobr film-award-category"> Выручка </span>
        <div class="dots"></div>
      </div>
      <span class="film-award-value">{{ showField(getProp(props.film, 'revenue')) }}</span>
    </li>
    <li class="film-details-item">
      <div class="flex-row film-details-item-left">
        <span class="nobr film-award-category"> Режиссер </span>
        <div class="dots"></div>
      </div>
      <span class="film-award-value">{{ showField(getProp(props.film, 'director')) }}</span>
    </li>
    <li class="film-details-item">
      <div class="flex-row film-details-item-left">
        <span class="nobr film-award-category"> Продакшен </span>
        <div class="dots"></div>
      </div>
      <span class="film-award-value">{{ showField(getProp(props.film, 'production')) }}</span>
    </li>
    <li class="film-details-item">
      <div class="flex-row film-details-item-left">
        <span class="nobr film-award-category"> Награды </span>
        <div class="dots"></div>
      </div>
      <span class="film-award-value">{{ showField(getProp(props.film, 'awardsSummary')) }}</span>
    </li>
  </ul>
</template>

<style>
.dots {
  display: none;
}

.film-details-items {
  row-gap: 12px;
  padding-top: 40px;
}

.film-details-item {
  column-gap: 5px;
}

.film-award-category {
  font-family: 'Play';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--palette-col12);
}

.film-award-value {
  font-family: 'Play';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  color: var(--palette-col4);
}

.film-details-item-left {
  width: 100%;
  align-items: baseline;
  column-gap: 5px;
  flex-wrap: nowrap;
  color: var(--palette-col4);
}

.film-details-item-right {
  color: var(--palette-col4);
}

.film-details-item {
  display: flex;
  flex-direction: column;
  row-gap: 4px;
}

@media (min-width: 376px) {
  .dots {
    display: block;
    width: 100%;
    border-bottom: 1px dotted var(--palette-col4);
  }

  .film-award-category,
  .film-award-value {
    font-family: 'Play';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
  }

  .film-details-item {
    flex-direction: row;
    flex-wrap: nowrap;
    row-gap: 24px;
  }

  .film-details-items {
    row-gap: 24px;
  }
}

@media (min-width: 550px) {
  .film-details-items {
    padding-top: 0;
  }
}

@media (min-width: 600px) {
  .film-details-item-left {
    width: 320px;
  }
}
</style>
