<script setup lang="ts">
import { computed } from 'vue'
import type { MessageHistoryItem } from '../types'
import { formatHistoryDate, formatHistoryTime } from '../utils/date'

const props = defineProps<{
  open: boolean
  items: MessageHistoryItem[]
}>()

const emit = defineEmits<{
  close: []
}>()

const groupedItems = computed(() => {
  const groups = new Map<string, MessageHistoryItem[]>()

  for (const item of props.items.slice(0, 60)) {
    const group = groups.get(item.date) ?? []
    group.push(item)
    groups.set(item.date, group)
  }

  return Array.from(groups, ([date, items]) => ({
    date,
    label: formatHistoryDate(date),
    items,
  }))
})
</script>

<template>
  <Teleport to="body">
    <Transition name="history">
      <div v-if="open" class="history-overlay" @click.self="emit('close')">
        <section
          class="history-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-title"
        >
          <header class="history-header">
            <div>
              <p>MEMORY LOG</p>
              <h2 id="history-title">写给你的历史</h2>
            </div>
            <button class="close-button" type="button" aria-label="关闭历史记录" @click="emit('close')">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <p class="history-hint">每次停笔后，都会悄悄留下一份当时的版本。</p>

          <div v-if="groupedItems.length" class="history-scroll">
            <section v-for="group in groupedItems" :key="group.date" class="history-group">
              <div class="history-date">
                <span>{{ group.label }}</span>
                <i></i>
              </div>

              <article v-for="item in group.items" :key="item.id" class="history-entry">
                <time>{{ formatHistoryTime(item.savedAt) }}</time>
                <p>{{ item.text || '这一版被轻轻清空了。' }}</p>
              </article>
            </section>
          </div>

          <div v-else class="history-empty">
            <span>✦</span>
            <p>还没有历史记录</p>
            <small>写下第一句话后，它会出现在这里。</small>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.history-overlay {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: grid;
  padding: 24px;
  background: rgba(47, 27, 23, 0.32);
  backdrop-filter: blur(10px);
  place-items: center;
}

.history-panel {
  display: flex;
  width: min(540px, 100%);
  max-height: min(720px, 88dvh);
  flex-direction: column;
  padding: 27px;
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 28px;
  background:
    radial-gradient(circle at 90% 0%, rgba(223, 157, 144, 0.17), transparent 32%),
    #fbf6ef;
  box-shadow: 0 34px 100px rgba(45, 25, 20, 0.28);
}

.history-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.history-header p,
.history-header h2,
.history-hint {
  margin: 0;
}

.history-header p {
  color: var(--coral);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.22em;
}

.history-header h2 {
  margin-top: 8px;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: 27px;
  font-weight: 600;
}

.close-button {
  display: grid;
  width: 35px;
  height: 35px;
  padding: 0;
  border: 1px solid rgba(108, 75, 64, 0.12);
  border-radius: 50%;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  place-items: center;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.close-button:hover {
  background: #fff;
  transform: rotate(5deg);
}

.close-button svg {
  width: 17px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.5;
}

.history-hint {
  margin-top: 12px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
}

.history-scroll {
  margin-top: 22px;
  padding-right: 5px;
  overflow-y: auto;
}

.history-group + .history-group {
  margin-top: 24px;
}

.history-date {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 9px;
}

.history-date span {
  color: var(--wine);
  font-family: var(--font-serif);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.history-date i {
  width: 100%;
  height: 1px;
  background: rgba(115, 75, 62, 0.09);
}

.history-entry {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 12px;
  padding: 11px 0;
}

.history-entry time {
  padding-top: 2px;
  color: rgba(105, 80, 70, 0.44);
  font-family: var(--font-display);
  font-size: 10px;
  font-style: italic;
}

.history-entry p {
  margin: 0;
  color: #56433c;
  font-family: var(--font-serif);
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
}

.history-empty {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  text-align: center;
}

.history-empty span {
  color: var(--rose);
  font-size: 30px;
}

.history-empty p {
  margin: 12px 0 0;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: 16px;
}

.history-empty small {
  margin-top: 7px;
  font-size: 11px;
}

.history-enter-active,
.history-leave-active {
  transition: opacity 0.25s ease;
}

.history-enter-active .history-panel,
.history-leave-active .history-panel {
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.history-enter-from,
.history-leave-to {
  opacity: 0;
}

.history-enter-from .history-panel,
.history-leave-to .history-panel {
  transform: translateY(18px) scale(0.97);
}

@media (max-width: 500px) {
  .history-overlay {
    align-items: end;
    padding: 10px;
  }

  .history-panel {
    max-height: 88dvh;
    padding: 23px 19px;
    border-radius: 25px;
  }
}
</style>
