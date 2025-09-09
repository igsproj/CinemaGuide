import type { ILoadRes, RefStates, ISelectElem } from '@/types/types'
import type { IFilm, IErrorDlg } from './interfaces-rt'

// export const imgApi = 'http://localhost:3000' // dev
export const imgApi = '../img' // prod

const minPassLen = 4 // мин длина пароля
const passNotPermit = /\s/ // запрещенные в пароле символы. (точно запрещаем пробел)

//******************************************************/

export const apiKey = '453526462d046a9a6d8ea53cb0590b77'

export const apiSetup = {
  mode: 'cors', // no-cors, *cors, same-origin
  redirect: 'follow',
  credentials: 'include', // cookie work! credentials are sent for all requests, even cross-origin ones
  referrerPolicy: 'no-referrer'
  // headers: {
  //   'api-key': apiKey
  // }
}

export function getErrorDlgData(descr: string): IErrorDlg {
  return <IErrorDlg>{
    buttons: [{ text: 'ok', event: 'close' }],
    descr: descr,
    disableCloseBtn: true
  }
}

export function getApiUrl(path: string): string {
  const rootApi = 'https://cinemaguide.skillbox.cc'
  return rootApi + '/' + path
}

export function showField(field: null | undefined | string): string {
  return !field ? '?' : field
}

export function getShotDescr(src: string): string {
  if (!isValidStr(src)) return ''

  const maxLen = 100

  if (src.length <= maxLen) return src

  const lpos = src.lastIndexOf(' ', maxLen)

  return `${src.slice(0, lpos)} ...`
}

export function getFilmLength(len: number): string {
  const hours = len / 60
  return `${Math.trunc(hours)} ч ${Math.floor((hours % 1) * 100)} мин`
}

export function setDefaultImg(film: IFilm) {
  const defBackdrop = imgApi + '/backdrop.webp'
  const defPoster = imgApi + '/poster.webp'

  if (!film.backdropUrl)
    // может быть null!
    film.backdropUrl = defBackdrop

  if (!film.posterUrl)
    // может быть null!
    film.posterUrl = defPoster
}

export function isWrongApiResponse(resp: any): boolean {
  return (
    isError(resp) ||
    isEmptyObj(resp, false) !== false ||
    getObjChild(resp, 'name') === 'PrismaClientValidationError'
  )
}

export function getProp(obj: Record<string, any> | undefined, attr: string): undefined | string {
  if (!obj) return

  return obj[attr]
}

export async function addFilms(
  storage: any,
  path: string,
  useLoadBuf: boolean = false,
  params?: Record<string, any>
): Promise<ILoadRes> {
  const resp = await loadData(
    getApiUrl(path),
    'json',
    undefined,
    Object.assign(clone(apiSetup), params)
  )

  if (isWrongApiResponse(resp)) {
    return {
      result: false,
      data: resp
    }
  }

  let loadBufId = ''
  if (useLoadBuf) loadBufId = storage.getStore().createLoadBuf()

  async function onFilmAdd(film: any) {
    await storage.addFilm(film, loadBufId)
    setDefaultImg(film)
  }

  try {
    // addFilm выбрасывает исключение если проблемы с данными
    if (Array.isArray(resp)) resp.forEach(async (film) => await onFilmAdd(film))
    else await onFilmAdd(resp)
  } catch (err) {
    return {
      result: false,
      data: err
    }
  }

  return {
    result: true,
    data: loadBufId
  }
}

export async function sendUserData(
  path: string,
  body: Record<string, string> | null | undefined,
  params: Record<string, any>
): Promise<ILoadRes> {
  if (body) {
    const regData = new URLSearchParams(body)
    params['body'] = regData.toString()
  }

  const resp = await loadData(
    getApiUrl(path),
    'json',
    undefined,
    Object.assign(clone(apiSetup), params)
  )

  if (isWrongApiResponse(resp) || resp.result === false || resp.error) {
    return {
      result: false,
      data: resp
    }
  }

  return {
    result: true,
    data: resp
  }
}

export async function loadFilm(
  storage: any,
  request: string,
  onOkCb: Function,
  useLoadBuf: boolean = false
): Promise<ILoadRes> {
  const resp = await addFilms(storage, request, useLoadBuf)
  if (resp.result) runAsFunction(onOkCb)(resp)

  return resp
}

export function setState(
  state: RefStates,
  val: number,
  emitFunc: Function,
  srcId?: string,
  msg?: string
) {
  state.value = val
  runAsFunction(emitFunc)('stateChanged', state.value, srcId, msg)
}

export function checkForm(data: HTMLFormElement, errorCb: Function, successCb: Function) {
  let pass = ''
  for (let i = 0; i < data.length; ++i) {
    const name = data[i].getAttribute('name')
    const val = (data[i] as HTMLInputElement).value

    if (name === 'email' && !validateEmail(val)) {
      errorCb('checkError', 'проверьте e-mail', data[i])
      return
    }

    if (name === 'name' && !isCyrPattern(val)) {
      errorCb('checkError', 'проверьте имя', data[i])
      return
    }

    if (name === 'surname' && !isCyrPattern(val)) {
      errorCb('checkError', 'проверьте фамилию', data[i])
      return
    }

    if (name === 'password') {
      pass = val
      if (isCyrPattern(val) || val.length < minPassLen || passNotPermit.test(val)) {
        errorCb('checkError', `проверьте пароль (${minPassLen} симв мин.)`, data[i])
        return
      }
    }

    if (name === 'passconfirm' && pass !== val) {
      errorCb('checkError', 'пароль не совпадает', data[i])
      return
    }
  }

  successCb(data)
}

/*********************************************************
lib
*********************************************************/
export function callClassListFunc(elem: HTMLElement, func: string, className: string) {
  const classList = Object.getPrototypeOf(elem.classList)[func] // получить функцию из прототипа
  classList.bind(elem.classList)(className) // вызвать функцию для данного элемента
}

export function isCyrPattern(str: string): boolean {
  const cyrillicPattern = /^[\u0400-\u04FF]+$/
  const res = cyrillicPattern.test(str)
  // console.log(res);
  return res
}

export function validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email)
}

// export function validateEmail(email: string): boolean {
//   const regex =
//     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//   return regex.test(email.toLowerCase())
// }

export function modalAction(src: Record<string, ISelectElem>, key: string, action: string) {
  if (!(key in src)) return

  const elem = src[key]
  if (action === 'open') {
    runAsFunction(elem.onOpen)()
    elem.show = true
  }

  if (action === 'close') {
    runAsFunction(elem.onClose)()
    elem.show = false
  }
}

export function tabSelect(src: Record<string, ISelectElem>, key: string) {
  if (!(key in src) || src[key].show) return

  for (const item in src) modalAction(src, item, 'close')

  modalAction(src, key, 'open')
}

export function isEmptyArray(arr: any): boolean {
  return Array.isArray(arr) && !arr.length
}

export function isValidStr(str: any): boolean {
  return typeof str === 'string' && str.length > 0
}

export function isError(obj: any): boolean {
  return obj instanceof Error
}

export function isFunction(func: any): boolean {
  return typeof func === 'function'
}

export function runAsFunction(func: any, defFunc = () => {}) {
  return isFunction(func) ? func : defFunc
}

async function getResponseAs(resp: Response, func: string) {
  if (func === 'arrayBuffer') return resp.arrayBuffer()

  if (func === 'blob') return resp.blob()

  // if (func === "bytes")
  //   return resp.bytes();

  if (func === 'formData') return resp.formData()

  if (func === 'json') return resp.json()

  if (func === 'text') return resp.text()

  return null
}

class NetworkError extends Error {
  resp = {
    url: '',
    status: 0,
    statusText: ''
  }
}

export async function loadData(
  url: string,
  fetchFunc = 'json',
  onErrorCb?: Function,
  fetchParams?: Record<string, any>
) {
  if (!navigator.onLine) return new NetworkError('Нет соединения. Проверьте сеть!')

  if (!isValidStr(url)) return new NetworkError('Не задан url!')

  let resp
  try {
    resp = await fetch(url, fetchParams)

    if (!resp.ok) {
      const err = new NetworkError('Ошибочный ответ сервера')
      err.resp = resp
      throw err
    }

    return await getResponseAs(resp, fetchFunc)
  } catch (err) {
    let res

    if (!resp) {
      // исключения в fetch когда нет сети
      const netErr = new NetworkError('Нет ответа от сервера')
      netErr.resp.url = url
      netErr.resp.status = 0
      netErr.resp.statusText = 'Нет ответа от сервера'
      res = netErr
    } else res = err

    runAsFunction(onErrorCb)(res)
    return res
  }
}

export function isLoadError(arr: [], breakOnFirstErr: boolean = true): boolean {
  let err = false
  for (let i = 0; i < arr.length; ++i) {
    if (isError(arr[i])) err = true
    if (breakOnFirstErr && err) break
  }

  return err
}

export function prepareString(value: string, strTrim: boolean, strCase: string): string {
  if (!isValidStr(value)) return value

  let res = value
  if (strTrim) res = res.trim()

  if (strCase == 'lower') res = res.toLowerCase()

  if (strCase == 'upper') res = res.toUpperCase()

  return res
}

/*
  использование :
  if (isEmptyObj(obj) !== false) // это пустой объект или вообще не объект
  if (isEmptyObj(obj) === false) // это точно объект и он не пустой
  параметр ignoreArray = true по умолчанию не рассматривает массив как объект. Если нужно проверять массив как объект то ignoreArray = false
*/
export function isEmptyObj(obj: unknown, ignoreArray = true): undefined | true | false {
  if (!obj || typeof obj !== 'object' || (ignoreArray && Array.isArray(obj))) return // undefined

  // return !Object.keys(obj).length; // короче, но нет смысла
  for (const key in obj) // этот вариант должен быть быстрее, т.к не получает все ключи Object.keys
    return false

  return true
}

export function parseString(str: string, del: string, cb: Function, cbArg?: unknown, trim = true) {
  let pos = -1
  let start = 0

  function t(s: string, trim: boolean): string {
    return trim === true ? s.trim() : s
  }

  while ((pos = str.indexOf(del, pos + 1)) != -1) {
    if (cb(t(str.slice(start, pos), trim), cbArg) === false) return false
    start = pos + 1
  }

  if (str.length > start) {
    pos = str.length
    if (cb(t(str.slice(start, pos), trim), cbArg) === false) return false
  }
  return true
}

export function getObjChild(
  // elem: Record<string, unknown>,
  elem: any,
  path: string,
  returnOnNotFound?: any
) {
  if (isEmptyObj(elem) !== false)
    // пустой объект или не объект
    return returnOnNotFound

  let res = elem
  let notFound = false
  parseString(path, '.', (substr: string) => {
    // parseString by default trims 'substr'
    if (res[substr] === undefined) {
      // res = returnOnNotFound;
      notFound = true
      return false
    }
    res = res[substr] as Record<string, unknown>
    return true
  })

  if (notFound) return returnOnNotFound

  return res
}

export function createUniqId(): number {
  return Math.floor(Math.random() * Date.now())
}

export function clone(src: any) {
  return JSON.parse(JSON.stringify(src))
}

export async function delay(msec: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), msec)
  })
}

export function sortAsc(prev: any, next: any, field: string): number {
  if (prev[field] < next[field]) return -1

  if (prev[field] === next[field]) return 0

  return 1
}

export function sortDesc(prev: any, next: any, field: string): number {
  if (prev[field] > next[field]) return -1

  if (prev[field] === next[field]) return 0

  return 1
}

export interface IFunctionId {
  id: number
  func: Function
}

export const clickOutsideCallBacks: IFunctionId[] = []

export function clickOutside(ev: Event) {
  clickOutsideCallBacks.forEach((item) => item.func(ev))
}

export function createInstId(instId: number, id: string): string {
  return String(instId) + '_' + id
}

export function addClickCb(newItem: IFunctionId) {
  if (!clickOutsideCallBacks.find((item) => item.id === newItem.id))
    clickOutsideCallBacks.push(newItem)
}

export function removeClickCb(id: number) {
  const index = clickOutsideCallBacks.findIndex((item) => item.id === id)
  if (index >= 0) clickOutsideCallBacks.splice(index, 1)
}
