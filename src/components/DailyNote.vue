<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useWorldStore } from '../stores/world'
import { formatTime } from '../utils/date'
import HistoryDrawer from './HistoryDrawer.vue'

type SaveState = 'idle' | 'saving' | 'saved'

const store = useWorldStore()
const draft = ref(store.messageForToday)
const saveState = ref<SaveState>(store.messageForToday ? 'saved' : 'idle')
const lastSavedLabel = ref(
  store.history[0] ? formatTime(new Date(store.history[0].savedAt)) : '',
)
const historyOpen = ref(false)
let saveTimer: ReturnType<typeof setTimeout> | null = null

const historyCount = computed(() => store.history.length)
const saveLabel = computed(() => {
  if (saveState.value === 'saving') return '正在保存'
  if (saveState.value === 'saved') {
    return lastSavedLabel.value ? `已自动保存 ${lastSavedLabel.value}` : '已自动保存'
  }
  return '写点什么吧'
})

function commitDraft(): void {
  store.saveMessage(draft.value)
  lastSavedLabel.value = formatTime()
  saveState.value = 'saved'
  saveTimer = null
}

function scheduleSave(): void {
  saveState.value = 'saving'
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(commitDraft, 650)
}

watch(draft, scheduleSave)

onBeforeUnmount(() => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    commitDraft()
  }
})
</script>

<template>
  <section class="note-card" aria-labelledby="note-title">
    <header class="note-header">
      <div class="note-heading">
        <span class="note-symbol" aria-hidden="true">“</span>
        <div>
          <p>DAILY WHISPER</p>
          <h2 id="note-title">今天想对你说</h2>
        </div>
      </div>

      <button
        class="history-button"
        type="button"
        :disabled="!historyCount"
        @click="historyOpen = true"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4.5 7.5h15M4.5 12h15M4.5 16.5h9" />
          <circle cx="18" cy="16.5" r="1.5" />
        </svg>
        历史
      </button>
    </header>

    <div class="note-paper">
      <textarea
        v-model="draft"
        maxlength="280"
        rows="5"
        aria-label="今天想对你说的话"
        placeholder="今天也有一句悄悄话，想留给你……"
      ></textarea>
      <span class="paper-corner" aria-hidden="true"></span>
    </div>

    <footer class="note-footer">
      <span class="save-state" :class="saveState">
        <i aria-hidden="true"></i>
        {{ saveLabel }}
      </span>
      <span class="char-count">{{ draft.length }} / 280</span>
    </footer>

    <HistoryDrawer
      :open="historyOpen"
      :items="store.history"
      @close="historyOpen = false"
    />
  </section>
</template>

<style scoped>
.note-card {
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 27px;
  background: rgba(255, 251, 246, 0.76);
  box-shadow: 0 18px 45px rgba(89, 58, 46, 0.07);
  backdrop-filter: blur(18px);
}

.note-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.note-heading {
  display: flex;
  gap: 9px;
  align-items: flex-start;
}

.note-symbol {
  display: grid;
  width: 33px;
  height: 33px;
  flex: 0 0 auto;
  border-radius: 12px;
  color: var(--coral);
  background: rgba(215, 126, 119, 0.11);
  font-family: var(--font-display);
  font-size: 30px;
  line-height: 1;
  place-items: center;
  transform: translateY(5px);
}

.note-heading p,
.note-heading h2 {
  margin: 0;
}

.note-heading p {
  color: var(--coral);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.17em;
}

.note-heading h2 {
  margin-top: 4px;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 600;
}

.history-button {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  min-height: 29px;
  padding: 0 9px;
  border: 1px solid rgba(120, 76, 62, 0.1);
  border-radius: 99px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.45);
  font-family: inherit;
  font-size: 9px;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.history-button:hover:not(:disabled) {
  color: var(--wine);
  background: #fff;
}

.history-button:disabled {
  cursor: default;
  opacity: 0.42;
}

.history-button svg {
  width: 13px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.4;
}

.note-paper {
  position: relative;
  margin-top: 15px;
}

.note-paper::before {
  position: absolute;
  top: 11px;
  bottom: 13px;
  left: 16px;
  width: 1px;
  background: rgba(204, 104, 96, 0.1);
  content: '';
}

.note-paper textarea {
  display: block;
  width: 100%;
  min-height: 112px;
  padding: 13px 13px 13px 27px;
  resize: none;
  border: 1px solid rgba(121, 79, 65, 0.08);
  border-radius: 16px;
  outline: none;
  color: #513e37;
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.38) 0,
      rgba(255, 255, 255, 0.38) 28px,
      rgba(132, 89, 74, 0.055) 29px
    ),
    rgba(255, 249, 242, 0.64);
  font-family: var(--font-serif);
  font-size: 12px;
  line-height: 29px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.note-paper textarea::placeholder {
  color: rgba(101, 77, 67, 0.38);
}

.note-paper textarea:focus {
  border-color: rgba(177, 94, 83, 0.21);
  background-color: rgba(255, 252, 248, 0.9);
  box-shadow: 0 0 0 4px rgba(204, 106, 97, 0.05);
}

.paper-corner {
  position: absolute;
  right: 12px;
  bottom: 11px;
  width: 12px;
  height: 12px;
  border-right: 1px solid rgba(151, 97, 80, 0.17);
  border-bottom: 1px solid rgba(151, 97, 80, 0.17);
}

.note-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.save-state {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  color: var(--muted);
  font-size: 9px;
}

.save-state i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #88a285;
  transition: background 0.2s ease;
}

.save-state.saving i {
  background: #d5a16e;
  animation: savePulse 1s ease-in-out infinite;
}

.char-count {
  color: rgba(105, 80, 70, 0.4);
  font-family: var(--font-display);
  font-size: 9px;
  font-style: italic;
}

@keyframes savePulse {
  50% {
    opacity: 0.35;
  }
}
</style>
