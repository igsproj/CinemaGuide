<script setup lang="ts">
import { States } from '@/types/types'
import { setState } from '@/lib/shared'
import { ref } from 'vue'

const emits = defineEmits(['stateChanged'])

const state = ref(States.new)
const errMsg = '404 - нет такой страницы'
const srcId = 'page404'

setState(state, States.error, emits, srcId, errMsg)
</script>
