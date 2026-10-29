export interface WordItem {
  id: string
  text: string
}

export interface MessageHistoryItem {
  id: string
  date: string
  text: string
  savedAt: string
}

export interface PersistedWorldState {
  messageByDate: Record<string, string>
  history: MessageHistoryItem[]
  hisWords: WordItem[]
  herWords: WordItem[]
  autoPlay: boolean
  reduceMotion: boolean
}

export interface AlbumPhoto {
  id: string
  src: string
  title: string
  date: string
  location: string
  note: string
  tag: string
}
