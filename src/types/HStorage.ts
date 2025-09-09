import { isValidStr, runAsFunction, createUniqId } from '@/lib/shared'
import { ref } from 'vue'

/*
гибрид для хранения объектов obj в виде общего хранилища : объекта {id: string, obj: {}},
с одновременным представлением его также как массива и дополнительных срезов (loadBuf). rep и loadBuf хранит ссылки на объекты из src
В объекте obj должен быть его уникальный идентификатор (по умолчанию id), название этого поля передается в конструктор
При добавлении obj, нужно передать его уникальный ключ add(id: string). Это значение будет его id как исходном представлении (src), так и массиве (rep)
так же в add можно передать название loadBuf, который предварительно нужно создать createLoadBuf

Что получается в результате. Пример. С сервера загружается массив одинаковых объектов - карточка товара с его уникальным идентификатором
Данный массив получаем по группам товара или сразу весь каталог
При вызове add товар добавляется в индексированный src, для быстрого получения по его id , сразу добавляется в rep, где удобно делать фильтры и поиск по всем карточкам
Кроме того, при загрузке по группам, можно создать для нее loadBuf (перед вызовом add) и передать это имя в add
Тогда весь товар по данной группе добавится в дополнительный срез с этим именем. В ряде случаем это удобнее, чем потом делать фильтры всего rep, чтобы
найти товар данной группы.

Исходный src можно сделать реактивным. constructor(srcReactive: boolean
Тогда внутри HStorage создается ref(src) тогда получаем getItem с учетом srcReactive
Это удобно, когда нужно менять реквизиты в объектах (допустим название товара) и сразу выводить это в шаблонах vue
!! Внимание. При реактивном поведении, в данной версии в rep и loadBuf элементы добавляются с помощью getItem ( с учетом srcReactive)
*/

export class HStorage {
  src: Record<string, Record<string, any>> = {} // исходное хранилище {id: string, obj: {}}
  rep: any[] = [] // rep (REPresentation) : дополнительное представление src как массива. нужен для сортировок, фильтров, поиска по любым полям

  loadBuf: Record<string, Record<string, any>[]> = {} // различные именованные срезы
  idField: string = 'id'

  srcReactive: boolean = false
  srcRef = ref<Record<string, Record<string, any>>>({})

  constructor(srcReactive: boolean = false, idField: string = '') {
    if (isValidStr(idField)) this.idField = idField

    if (typeof srcReactive === 'boolean') this.srcReactive = srcReactive

    if (this.srcReactive) this.srcRef = ref(this.src)
  }

  getSrc() {
    return this.src
  }

  getRep() {
    return this.rep
  }

  getItem(id: string | undefined) {
    if (!id) return {}

    const val = this.srcReactive ? this.srcRef.value : this.src
    return val[id]
  }

  findItem(field: string, value: any) {
    return this.rep.find((item) => item[field] === value)
  }

  add(id: string, val: Record<string, any>, loadBufId: string) {
    let res
    if (id in this.src) {
      // console.warn(`'add' id = ${id} уже есть в базе, пропускаю`)
      res = false
    } else {
      this.src[id] = val
      this.rep.push(this.getItem(id))
      res = true
    }

    if (isValidStr(loadBufId) && loadBufId in this.loadBuf)
      this.loadBuf[loadBufId].push(this.getItem(id))

    return res
  }

  _delFromArr(arr: any[], fieldName: string, fieldVal: any) {
    const index = arr.findIndex((item) => item[fieldName] === fieldVal)
    if (index >= 0) arr.splice(index, 1)
  }

  /*
  первичная ссылка на obj находится в src.
  сначала нужно удалить из rep, затем из всех loadBuffers, затем из src
  */
  remove(id: string) {
    this._delFromArr(this.rep, this.idField, id)
    for (const key in this.loadBuf) this._delFromArr(this.loadBuf[key], this.idField, id)
    delete this.src[id]
  }

  createLoadBuf(bufName: string = '') {
    const id = isValidStr(bufName) && !(bufName in this.loadBuf) ? bufName : String(createUniqId())
    this.loadBuf[id] = []
    return id
  }

  deleteLoadBuf(loadBufId: string) {
    // !! warning : storage функция может хранить в data ссылки на элементы буфера, удаление из буфера только если нужно !
    delete this.loadBuf[loadBufId]
  }

  getLoadBuf(loadBufId: string) {
    return this.loadBuf[loadBufId]
  }

  walkRep(cb: Function) {
    this.rep.forEach((elem) => runAsFunction(cb)(elem))
  }

  walkSrc(cb: Function) {
    for (const key in this.src) runAsFunction(cb)(key, this.getItem(key))
  }
}
