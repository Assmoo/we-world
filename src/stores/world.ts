import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { MessageHistoryItem, PersistedWorldState, WordItem } from '../types'
import { dateKey } from '../utils/date'

const STORAGE_KEY = 'we-world:v1'
const MAX_HISTORY = 120
const MAX_WORDS = 8

const defaultHisWords: WordItem[] = [
  { id: 'his-film', text: '深夜电影' },
  { id: 'his-coffee', text: '雨天咖啡' },
  { id: 'his-road', text: '公路与远方' },
  { id: 'his-record', text: '老唱片' },
  { id: 'his-walk', text: '一起散步' },
  { id: 'his-noodle', text: '好吃的面' },
]

const defaultHerWords: WordItem[] = [
  { id: 'her-sunset', text: '海边日落' },
  { id: 'her-latte', text: '热拿铁' },
  { id: 'her-animal', text: '小动物' },
  { id: 'her-gardenia', text: '栀子花' },
  { id: 'her-letter', text: '手写信' },
  { id: 'her-slow', text: '慢慢生活' },
]

function createId(prefix: string): string {
  const randomPart =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)

  return `${prefix}-${randomPart}`
}

function cloneWords(words: WordItem[]): WordItem[] {
  return words.map((word) => ({ ...word }))
}

function isWordItem(value: unknown): value is WordItem {
  if (!value || typeof value !== 'object') return false
  const word = value as Record<string, unknown>
  return typeof word.id === 'string' && typeof word.text === 'string'
}

function isHistoryItem(value: unknown): value is MessageHistoryItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.date === 'string' &&
    typeof item.text === 'string' &&
    typeof item.savedAt === 'string'
  )
}

function defaultState(): PersistedWorldState {
  return {
    messageByDate: {},
    history: [],
    hisWords: cloneWords(defaultHisWords),
    herWords: cloneWords(defaultHerWords),
    autoPlay: true,
    reduceMotion: false,
  }
}

function loadState(): PersistedWorldState {
  const fallback = defaultState()

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback

    const parsed = JSON.parse(raw) as Record<string, unknown>
    const messageByDate =
      parsed.messageByDate && typeof parsed.messageByDate === 'object'
        ? (parsed.messageByDate as Record<string, string>)
        : fallback.messageByDate
    const history = Array.isArray(parsed.history)
      ? parsed.history.filter(isHistoryItem)
      : fallback.history
    const hisWords = Array.isArray(parsed.hisWords)
      ? parsed.hisWords.filter(isWordItem)
      : fallback.hisWords
    const herWords = Array.isArray(parsed.herWords)
      ? parsed.herWords.filter(isWordItem)
      : fallback.herWords

    return {
      messageByDate,
      history,
      hisWords: hisWords.length ? hisWords : fallback.hisWords,
      herWords: herWords.length ? herWords : fallback.herWords,
      autoPlay: typeof parsed.autoPlay === 'boolean' ? parsed.autoPlay : true,
      reduceMotion: typeof parsed.reduceMotion === 'boolean' ? parsed.reduceMotion : false,
    }
  } catch {
    return fallback
  }
}

export const useWorldStore = defineStore('world', () => {
  const initialState = loadState()
  const messageByDate = ref<Record<string, string>>(initialState.messageByDate)
  const history = ref<MessageHistoryItem[]>(initialState.history)
  const hisWords = ref<WordItem[]>(initialState.hisWords)
  const herWords = ref<WordItem[]>(initialState.herWords)
  const autoPlay = ref(initialState.autoPlay)
  const reduceMotion = ref(initialState.reduceMotion)

  const currentDayKey = computed(() => dateKey())
  const messageForToday = computed(() => messageByDate.value[currentDayKey.value] ?? '')

  function snapshot(): PersistedWorldState {
    return {
      messageByDate: messageByDate.value,
      history: history.value,
      hisWords: hisWords.value,
      herWords: herWords.value,
      autoPlay: autoPlay.value,
      reduceMotion: reduceMotion.value,
    }
  }

  function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()))
  }

  function saveMessage(text: string): void {
    const key = dateKey()
    messageByDate.value[key] = text

    const latestForDay = history.value.find((item) => item.date === key)
    if (latestForDay?.text === text) return

    history.value.unshift({
      id: createId('message'),
      date: key,
      text,
      savedAt: new Date().toISOString(),
    })

    if (history.value.length > MAX_HISTORY) {
      history.value.splice(MAX_HISTORY)
    }
  }

  function wordList(side: 'his' | 'her') {
    return side === 'his' ? hisWords : herWords
  }

  function addWord(side: 'his' | 'her', text: string): boolean {
    const cleanText = text.trim()
    const list = wordList(side)
    if (!cleanText || list.value.length >= MAX_WORDS) return false

    list.value.push({
      id: createId(side),
      text: cleanText.slice(0, 12),
    })
    return true
  }

  function updateWord(side: 'his' | 'her', id: string, text: string): void {
    const cleanText = text.trim().slice(0, 12)
    const item = wordList(side).value.find((word) => word.id === id)
    if (item && cleanText) item.text = cleanText
  }

  function removeWord(side: 'his' | 'her', id: string): void {
    const list = wordList(side)
    list.value = list.value.filter((word) => word.id !== id)
  }

  watch(
    [messageByDate, history, hisWords, herWords, autoPlay, reduceMotion],
    persist,
    { deep: true },
  )

  return {
    messageByDate,
    history,
    hisWords,
    herWords,
    autoPlay,
    reduceMotion,
    currentDayKey,
    messageForToday,
    saveMessage,
    addWord,
    updateWord,
    removeWord,
  }
})
