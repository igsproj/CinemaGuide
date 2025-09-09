<script setup lang="ts">
import CloseIcon from '@/components/icons/CloseIcon.vue'
import PlayIcon from '@/components/icons/PlayIcon.vue'
import PauseIcon from '@/components/icons/PauseIcon.vue'
import VideoLoaderIcon from '@/components/icons/VideoLoaderIcon.vue'
import { ref, onUpdated, computed } from 'vue'
import { PlayerYT } from '@/types/PlayerYT'
import { getErrorDlgData } from '@/lib/shared'

const emits = defineEmits(['close', 'error'])

const props = defineProps({
  videoId: String,
  backgroundUrl: String,
  show: Boolean
})

// UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5
const playerStatus = ref(-1) // YT.PlayerState.UNSTARTED - не нужно ставить здесь значение из YT.PlayerState, т.к плеер может быть не загружен, тогда упадем здесь
const mouseOverPlayer = ref(false)
const showPlayer = ref(false)
const playerTitle = ref('')
const playerReady = ref(false)
const loadSpinner = ref(true)
const srcId = 'playerYT'

let playerInit = false
let playerStarted = false
let _yt: PlayerYT
const desktopWidth = 1200

const getBackImg = computed(() => ({
  'background-image': isPlayerStatus('PAUSED') ? `url(${props.backgroundUrl})` : 'none'
}))

onUpdated(() => {
  // функция должна вызываться только один раз. для этого - playerInit
  if (!PlayerYT.getYtApi()) {
    emits('error', getErrorDlgData('Плеер не загружен!'), srcId)
    return
  }

  if (!props.show || playerInit) return

  const onStateChange = (ev: Record<string, any>) => {
    playerStatus.value = ev.data

    if (isPlayerStatus('PLAYING') && !playerStarted) {
      // первый старт
      playerStarted = true
      loadSpinner.value = false
      showPlayer.value = true
    }

    if (ev.data === 0) onClose() // widgetApi.PlayerState.ENDED
  }

  const onReady = () => {
    playerReady.value = true
    playerTitle.value = _yt.player.videoTitle
  }

  const onError = () => {
    loadSpinner.value = false
    showPlayer.value = true
  }

  if (props.videoId) {
    _yt = new PlayerYT('player', props.videoId, onStateChange, onReady, onError, 960, 540)
    playerInit = true
  }
})

/********************************************************
functions
********************************************************/
function onMouseOver() {
  if (window.innerWidth >= desktopWidth) mouseOverPlayer.value = true
}

function onMouseOut() {
  if (window.innerWidth >= desktopWidth) mouseOverPlayer.value = false
}

function isPlayerStatus(status: string) {
  const widgetApi = PlayerYT.getYtApi()
  return widgetApi ? playerStatus.value === widgetApi.PlayerState[status] : -1
}

function onPlayerClick() {
  if (isPlayerStatus('PAUSED')) {
    if (_yt instanceof PlayerYT) _yt.player.playVideo()
    showPlayer.value = true
  }

  if (isPlayerStatus('PLAYING')) {
    if (_yt instanceof PlayerYT) _yt.player.pauseVideo()
    showPlayer.value = false
  }
}

function onClose() {
  playerInit = false
  playerStarted = false
  showPlayer.value = false
  loadSpinner.value = true

  playerStatus.value = -1 // YT.PlayerState.UNSTARTED
  emits('close')
}
</script>

<template>
  <div class="overlay" v-if="props.show">
    <div class="video-player-wrap abs-xy-center">
      <button class="flat-btn close-btn" @click="onClose()">
        <CloseIcon class="close-icon" />
      </button>

      <div
        class="owner-size-click video-player"
        @click="onPlayerClick()"
        :style="getBackImg"
        @mouseover="onMouseOver()"
        @mouseout="onMouseOut()"
      >
        <div class="video-player-area" v-show="showPlayer">
          <div id="player"></div>
        </div>

        <button
          class="flat-btn play-control-icon abs-xy-center fade-in"
          v-if="isPlayerStatus('PAUSED')"
        >
          <PlayIcon class="pause-play-icon" />
        </button>

        <button
          class="flat-btn play-control-icon abs-xy-center fade-in"
          v-if="isPlayerStatus('PLAYING') && mouseOverPlayer"
          @mouseover="onMouseOver()"
        >
          <PauseIcon class="pause-play-icon" />
        </button>

        <div
          class="flex-row flex-align-center player-title abs-x-center fade-in"
          v-if="isPlayerStatus('PAUSED')"
        >
          <span class="pause-titles">{{ playerTitle }}</span>
        </div>

        <div class="load-spinner abs-xy-center" v-if="loadSpinner">
          <VideoLoaderIcon class="rotating" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.load-spinner {
  position: absolute;
  width: 40px;
  height: 40px;
}

.pause-titles {
  font-family: 'Play';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: var(--palette-col4);
}

.player-title {
  position: absolute;
  bottom: 4%;
  width: 100%;
  height: 80px;
  padding: 40px;
  background: var(--palette-col15);
  color: var(--palette-col4);
}

.play-control-icon {
  position: absolute;
  z-index: 0;
}

.pause-icon {
  position: fixed;
}

.close-icon {
  width: 32px;
  height: 32px;
}

.pause-play-icon {
  width: 64px;
  height: 64px;
}

.video-player {
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: 16/9;
  /* pointer-events: none; */

  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  height: 56.25%;
}

.video-player-area {
  height: 100%;
}

.video-player-area iframe {
  width: 300%;
  height: 100%;
  margin-left: -100%;
}

.video-player-wrap {
  position: fixed;
  background: #393b3c;
  border: 1px solid var(--palette-col12);
  width: 100%;
  z-index: 10;
}

@media (min-width: 813px) {
  .pause-titles {
    font-size: 24px;
    line-height: 32px;
  }

  .player-title {
    width: 95%;
  }

  .close-icon {
    width: 48px;
    height: 48px;
  }

  .pause-play-icon {
    width: 80px;
    height: 80px;
  }
}

@media (min-width: 960px) {
  .video-player-wrap {
    width: 960px;
  }
}
</style>
