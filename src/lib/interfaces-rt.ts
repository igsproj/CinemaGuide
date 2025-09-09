export interface IFilm extends Record<string, any> {
  awardsSummary: null | number // string ?
  backdropUrl: null | string
  budget: null | string
  cast: Array<string>
  countriesOfOrigin: Array<string>
  director: null | string
  genres: Array<string>
  homepage: null | string
  id: number
  keywords: Array<string>
  language: null | string
  languages: Array<string>
  originalTitle: null | string
  plot: null | string
  posterUrl: null | string
  production: null | string
  releaseDate: null | string
  releaseYear: null | number
  revenue: null | string
  runtime: null | number
  searchL: null | string
  status: null | string
  title: null | string
  tmdbRating: null | number
  trailerUrl: null | string
  trailerYouTubeId: null | string
  inFav?: boolean
}

export interface IButtonsDlg extends Record<string, string> {
  text: string
  event: string
}

export interface IErrorDlg extends Record<string, any> {
  buttons: Array<IButtonsDlg>
  message: string
  descr: string
  show: boolean
  disableCloseBtn: boolean
  srcId?: string
}
