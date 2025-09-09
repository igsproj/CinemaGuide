import { defineStore } from 'pinia'
import { isValidStr, getObjChild } from '@/lib/shared'
import type { IFilm } from '@/lib/interfaces-rt'
import { createCheckers } from 'ts-interface-checker'
import checkFilmRules from '@/lib/interfaces-rt-ti'
import { HStorage } from '@/types/HStorage'

export const useFilmsStore = defineStore('films', () => {
  const { FilmTi } = createCheckers(checkFilmRules)

  const store = new HStorage(true)

  const data: Record<string, any> = {
    top10: null,
    genres: null,
    random: null
  } // динамически сюда будут добавляться ключи "fav", "profile" при загрузке профиля, также данные по каждому жанру

  function getStore() {
    return store
  }

  function setData(key: string | undefined, val: any, noRewrite: boolean = false): void {
    if (!key) return

    if (noRewrite && key in data && data[key])
      // защита от перезаписи в 'data'
      return

    data[key] = val
  }

  function getData(key: string | undefined) {
    if (key) return data[key]
  }

  function removeData(key: string | undefined) {
    if (key) delete data[key]
  }

  function isInFav(id: number | string): boolean {
    return getObjChild(getData('profile'), 'data.favorites', []).includes(String(id))
  }

  async function addFilm(film: IFilm, loadBufId: string) {
    const id = String(film.id)

    if (!isValidStr(id)) throw new TypeError('addFilm: значение id не является валидным')

    // динамическая проверка данных по шаблону
    try {
      FilmTi.check(film)
    } catch (err) {
      console.error(film)
      throw new TypeError(`${id} : ${err}`)
    }

    await getData('profile') // перед добавлением, нужно проверить если здесь промис. Если да, то ждать его (профиль может еще загружаться в App.vue)

    film.inFav = isInFav(film.id) // добавить информацию об избранном (на момент получения профиля)

    return store.add(id, film, loadBufId)
  }

  return {
    addFilm,
    getData,
    setData,
    removeData,
    getStore,
    isInFav
  }
})
