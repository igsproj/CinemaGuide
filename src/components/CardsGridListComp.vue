<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { isValidStr, getProp } from '@/lib/shared'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import type { IFilm } from '@/lib/interfaces-rt'

const props = defineProps({
  items: Array,
  pageName: String,
  imgField: String,
  itemClass: String,
  gridClass: String,
  param: String,
  descrField: String,
  showNumbers: Boolean,
  showDelete: Boolean,
  cardImage: String
})

const emits = defineEmits(['cardClick', 'clickFav'])
</script>

<template>
  <ul class="list-reset" :class="props.gridClass">
    <li
      class="grid-list-item"
      :class="props.itemClass"
      v-for="(item, index) in props.items"
      :key="(item as IFilm).id"
    >
      <div
        class="flex-row flex-justify-center flex-align-center card-number"
        v-if="props.showNumbers"
      >
        <span class="film-number">{{ index + 1 }}</span>
      </div>

      <button
        class="flat-btn delete-film"
        @click="emits('clickFav', (item as IFilm).id)"
        v-if="props.showDelete"
      >
        <CloseIcon class="close-icon" />
      </button>

      <RouterLink
        :to="{ name: props.pageName, params: { id: getProp(item as IFilm, props.param ?? '') } }"
        @click="emits('cardClick')"
      >
        <div class="flex-column flex-justify-end grid-list-content" :class="props.itemClass">
          <img :src="getProp(item as IFilm, props.imgField ?? '')" :class="props.cardImage" />
          <div
            class="card-descr flex-column flex-justify-center"
            v-if="isValidStr(props.descrField)"
          >
            <span>{{ getProp(item as IFilm, props.descrField ?? '') }}</span>
          </div>
        </div>
      </RouterLink>
    </li>
  </ul>
</template>

<style>
.card-number {
  position: absolute;
  z-index: 10;
  left: -12px;
  top: -12px;
  width: 62px;
  height: 48px;
  background: var(--palette-col4);
  border-radius: 50px;

  font-family: 'Play';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: var(--palette-col5);
}

.card-descr {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  color: var(--palette-col4);
  text-align: center;
  height: 84px;
  background-color: var(--palette-col6);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.item-film {
  background-position: left;
  background-size: 99% 100%;
  min-height: 336px;
  width: 224px;
}

.genres-item {
  background-position: top;
  background-size: 290px 220px;
  min-height: 304px;
  width: 290px;
  color: var(--palette-col4);
  font-family: 'Play';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
}

.grid-list-item {
  position: relative;
  border: 1px solid var(--palette-col10);
  filter: drop-shadow(0px 0px 80px var(--palette-col11));
  border-radius: 16px;
  cursor: pointer;
}

.grid-list-content {
  padding: 15px 15px;
  background-repeat: no-repeat;
  border-radius: 16px;
}
</style>
