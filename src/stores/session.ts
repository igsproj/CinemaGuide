import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IProfile } from '@/types/types'

export const useSession = defineStore('session', () => {
  const loggedIn = ref(false)

  const profile = ref(<IProfile>{})

  function getLoggedIn() {
    return loggedIn.value
  }

  function setLoggedIn(val: boolean) {
    loggedIn.value = val
  }

  function setProfile(val: IProfile) {
    profile.value = val
  }

  function getProfile() {
    return profile.value
  }

  return {
    getLoggedIn,
    setLoggedIn,
    setProfile,
    getProfile
  }
})
