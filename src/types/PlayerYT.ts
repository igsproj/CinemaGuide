export class PlayerYT {
  divId = ''
  vidId = ''
  player //= null
  width = 640
  height = 360

  constructor(
    divId: string,
    vidId: string,
    onStateChange: (ev: Record<string, any>) => void,
    onReady: () => void,
    onError: (ev: Record<string, any>) => void,
    width: number = 0,
    height: number = 0
  ) {
    if (width > 0) this.width = width
    if (height > 0) this.height = height

    this.divId = divId
    this.vidId = vidId

    if (typeof onStateChange === 'function') this.onPlayerStateChange = onStateChange
    if (typeof onReady === 'function') this.onPlayerReady = onReady
    if (typeof onError === 'function') this.onPlayerError = onError

    this.player = this.createPlayer()
  }

  onPlayerStateChange(ev: Record<string, any>) {
    console.log('builtin: onPlayerStateChange', ev.data)
  }

  onPlayerReady() {
    console.log('builtin: onPlayerReady')
  }

  onPlayerError(ev: Record<string, any>) {
    console.log('builtin: onPlayerError')
    console.log(ev)
  }

  createPlayer() {
    const widgetApi = PlayerYT.getYtApi()
    if (!widgetApi) return {} //null

    return new widgetApi.Player(this.divId, {
      width: this.width,
      height: this.height,
      videoId: this.vidId,
      playerVars: {
        autoplay: 1,
        playsinline: 1,
        controls: 0,
        enablejsapi: 1,
        fs: 0,
        // rel: 0, // это больше не работает
        // modestbranding: 1, // это больше не работает
        showinfo: 0
      },
      events: {
        onReady: this.onPlayerReady,
        onStateChange: this.onPlayerStateChange,
        onError: this.onPlayerError
      }
    })
  }

  static getYtApi() {
    const YT = Object.getOwnPropertyDescriptor(window, 'YT') // widget api хранится в globalThis.YT
    return YT ? YT.value : null // для JS это просто globalThis.YT
  }
}
