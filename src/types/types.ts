import type { Ref } from 'vue'

export enum States {
  new = -2,
  loading = -1,
  loaded = 1,
  error = 0,
  done = 2, // ready
  ready = 3
}

export type RefStates = Ref<States>

export interface IProfile {
  name: string
  surname: string
  email: string
  favorites: []
}

export interface ILoadRes {
  result: boolean
  data?: any
}

export interface ISelectElem {
  show: boolean
  onOpen?: Function
  onClose?: Function
}
