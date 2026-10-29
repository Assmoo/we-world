<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { WordItem } from '../types'
import { useWorldStore } from '../stores/world'

const props = defineProps<{
  side: 'his' | 'her'
  title: string
  eyebrow: string
  tone: 'rose' | 'sage'
  words: WordItem[]
}>()

const store = useWorldStore()
const rotateOffset = ref(0)
const editingId = ref<string | null>(null)
const adding = ref(false)
const editText = ref('')
const errorMessage = ref('')
const editInput = ref<HTMLInputElement | null>(null)
let rotationTimer: ReturnType<typeof setInterval> | null = null

const positions = [
  { x: 3, y: 13, rotation: -4 },
  { x: 53, y: 8, rotation: 3 },
  { x: 23, y: 43, rotation: 2 },
  { x: 63, y: 45, rotation: -5 },
  { x: 5, y: 65, rotation: 4 },
  { x: 48, y: 70, rotation: -2 },
  { x: 29, y: 25, rotation: 6 },
  { x: 12, y: 84, rotation: -3 },
]

const isEditing = computed(() => Boolean(editingId.value) || adding.value)
const canAdd = computed(() => props.words.length < 8)
const arrangedWords = computed(() => {
  if (!props.words.length) return []

  return props.words.map((_, index) => {
    const word = props.words[(index + rotateOffset.value) % props.words.length]
    const position = positions[index % positions.length]
    return { word, position }
  })
})

function chipStyle(index: number, rotation: number): Record<string, string> {
  return {
    '--delay': `${index * -0.58}s`,
    '--duration': `${3.8 + (index % 4) * 0.45}s`,
    '--rotation': `${rotation}deg`,
  }
}

function stopRotation(): void {
  if (rotationTimer) {
    clearInterval(rotationTimer)
    rotationTimer = null
  }
}

function startRotation(): void {
  stopRotation()
  if (store.reduceMotion || props.words.length < 2) return

  rotationTimer = setInterval(() => {
    if (!isEditing.value) {
      rotateOffset.value = (rotateOffset.value + 1) % props.words.length
    }
  }, 3600)
}

async function focusEditor(): Promise<void> {
  await nextTick()
  editInput.value?.focus()
}

function startAdd(): void {
  if (!canAdd.value) return
  editingId.value = null
  adding.value = true
  editText.value = ''
  errorMessage.value = ''
  void focusEditor()
}

function startEdit(word: WordItem): void {
  editingId.value = word.id
  adding.value = false
  editText.value = word.text
  errorMessage.value = ''
  void focusEditor()
}

function cancelEdit(): void {
  editingId.value = null
  adding.value = false
  editText.value = ''
  errorMessage.value = ''
}

function saveEdit(): void {
  const text = editText.value.trim()
  if (!text) {
    errorMessage.value = '写一个喜欢的词吧'
    return
  }

  if (adding.value) {
    if (!store.addWord(props.side, text)) {
      errorMessage.value = '最多保留 8 个词条'
      return
    }
  } else if (editingId.value) {
    store.updateWord(props.side, editingId.value, text)
  }

  cancelEdit()
}

function removeCurrent(): void {
  if (!editingId.value) return
  store.removeWord(props.side, editingId.value)
  cancelEdit()
}

watch(
  () => [isEditing.value, props.words.length, store.reduceMotion] as const,
  startRotation,
)

onMounted(startRotation)
onBeforeUnmount(stopRotation)
</script>

<template>
  <article class="favorite-card" :class="`tone-${tone}`">
    <header class="favorite-header">
      <div>
        <p>{{ eyebrow }}</p>
        <h3>{{ title }}</h3>
      </div>
      <button
        class="add-button"
        type="button"
        :disabled="!canAdd"
        :title="canAdd ? '添加词条' : '最多 8 个词条'"
        :aria-label="`给${title}添加词条`"
        @click="startAdd"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </header>

    <div class="word-stage">
      <div class="stage-ring ring-one" aria-hidden="true"></div>
      <div class="stage-ring ring-two" aria-hidden="true"></div>

      <button
        v-for="(item, index) in arrangedWords"
        :key="item.word.id"
        class="word-chip"
        type="button"
        :style="{
          left: `${item.position.x}%`,
          top: `${item.position.y}%`,
          ...chipStyle(index, item.position.rotation),
        }"
        @click="startEdit(item.word)"
      >
        {{ item.word.text }}
      </button>

      <p v-if="!words.length" class="empty-words">还没有写下喜欢的词</p>

      <Transition name="editor">
        <form v-if="isEditing" class="word-editor" @submit.prevent="saveEdit">
          <div class="editor-row">
            <input
              ref="editInput"
              v-model="editText"
              maxlength="12"
              :placeholder="adding ? '新的喜欢…' : '编辑词条'"
              aria-label="编辑喜欢的词条"
              @keydown.esc="cancelEdit"
            />
            <button class="confirm-button" type="submit" aria-label="保存词条">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m5 12.5 4.2 4.2L19 7.5" />
              </svg>
            </button>
            <button
              v-if="editingId"
              class="remove-button"
              type="button"
              aria-label="删除词条"
              @click="removeCurrent"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 7h14M9 7V5h6v2M8 10v8M12 10v8M16 10v8M6.5 7l.8 13h9.4l.8-13" />
              </svg>
            </button>
            <button class="cancel-button" type="button" aria-label="取消编辑" @click="cancelEdit">
              ×
            </button>
          </div>
          <span v-if="errorMessage" class="editor-error">{{ errorMessage }}</span>
        </form>
      </Transition>
    </div>

    <footer class="favorite-footer">
      <span>{{ words.length }} / 8</span>
      <span>轻触词条可编辑</span>
    </footer>
  </article>
</template>

<style scoped>
.favorite-card {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 262px;
  flex-direction: column;
  padding: 15px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 23px;
  box-shadow: 0 15px 34px rgba(80, 53, 42, 0.055);
}

.tone-rose {
  background:
    radial-gradient(circle at 100% 0%, rgba(221, 141, 132, 0.22), transparent 36%),
    rgba(252, 241, 237, 0.82);
}

.tone-sage {
  background:
    radial-gradient(circle at 100% 0%, rgba(143, 166, 133, 0.23), transparent 36%),
    rgba(240, 245, 236, 0.82);
}

.favorite-header {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.favorite-header p,
.favorite-header h3 {
  margin: 0;
}

.favorite-header p {
  color: var(--coral);
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.17em;
}

.tone-sage .favorite-header p {
  color: #6f8c69;
}

.favorite-header h3 {
  margin-top: 4px;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 600;
}

.add-button {
  display: grid;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 1px solid rgba(113, 78, 65, 0.12);
  border-radius: 50%;
  color: var(--wine);
  background: rgba(255, 255, 255, 0.48);
  cursor: pointer;
  place-items: center;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.add-button:hover:not(:disabled) {
  background: #fff;
  transform: rotate(7deg);
}

.add-button:disabled {
  cursor: default;
  opacity: 0.3;
}

.add-button svg {
  width: 14px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.5;
}

.word-stage {
  position: relative;
  min-height: 178px;
  flex: 1;
  margin: 7px -6px 0;
  overflow: hidden;
}

.stage-ring {
  position: absolute;
  border: 1px solid rgba(115, 78, 64, 0.06);
  border-radius: 50%;
  pointer-events: none;
}

.ring-one {
  top: 33px;
  left: 13%;
  width: 150px;
  height: 68px;
  transform: rotate(-21deg);
}

.ring-two {
  right: -27px;
  bottom: 22px;
  width: 130px;
  height: 54px;
  transform: rotate(29deg);
}

.tone-sage .stage-ring {
  border-color: rgba(91, 122, 83, 0.08);
}

.word-chip {
  position: absolute;
  z-index: 2;
  max-width: 105px;
  padding: 7px 9px;
  overflow: hidden;
  border: 1px solid rgba(137, 81, 68, 0.1);
  border-radius: 99px;
  color: #744b43;
  background: rgba(255, 255, 255, 0.68);
  box-shadow: 0 6px 17px rgba(103, 62, 49, 0.055);
  font-family: var(--font-serif);
  font-size: 10px;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition:
    left 0.95s cubic-bezier(0.22, 1, 0.36, 1),
    top 0.95s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.2s ease,
    box-shadow 0.2s ease;
  animation: wordFloat var(--duration) ease-in-out var(--delay) infinite alternate;
}

.word-chip:hover {
  z-index: 5;
  background: #fffdfa;
  box-shadow: 0 9px 22px rgba(103, 62, 49, 0.12);
}

.tone-sage .word-chip {
  border-color: rgba(91, 122, 83, 0.1);
  color: #53674f;
  background: rgba(255, 255, 255, 0.66);
}

.empty-words {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  color: var(--muted);
  font-family: var(--font-serif);
  font-size: 10px;
  white-space: nowrap;
  transform: translate(-50%, -50%);
}

.word-editor {
  position: absolute;
  z-index: 10;
  right: 4px;
  bottom: 2px;
  left: 4px;
  padding: 9px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 14px;
  background: rgba(255, 252, 248, 0.95);
  box-shadow: 0 12px 30px rgba(79, 49, 40, 0.16);
  backdrop-filter: blur(15px);
}

.editor-row {
  display: flex;
  gap: 4px;
  align-items: center;
}

.editor-row input {
  width: 100%;
  min-width: 0;
  height: 28px;
  padding: 0 7px;
  border: 1px solid rgba(119, 75, 62, 0.12);
  border-radius: 8px;
  outline: none;
  color: var(--ink);
  background: #fffdfa;
  font-family: var(--font-serif);
  font-size: 10px;
}

.editor-row button {
  display: grid;
  width: 27px;
  height: 27px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  place-items: center;
}

.editor-row svg {
  width: 13px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.confirm-button {
  color: #fff;
  background: var(--wine);
}

.remove-button {
  color: var(--coral);
  background: rgba(194, 91, 83, 0.1);
}

.cancel-button {
  color: var(--muted);
  background: transparent;
  font-size: 16px;
}

.editor-error {
  display: block;
  margin-top: 5px;
  color: var(--coral);
  font-size: 9px;
}

.favorite-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 7px;
  border-top: 1px solid rgba(118, 80, 66, 0.07);
  color: rgba(106, 79, 68, 0.42);
  font-size: 8px;
}

.favorite-footer span:first-child {
  font-family: var(--font-display);
  font-style: italic;
}

.editor-enter-active,
.editor-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.editor-enter-from,
.editor-leave-to {
  opacity: 0;
  transform: translateY(7px) scale(0.98);
}

@keyframes wordFloat {
  from {
    transform: translateY(-3px) rotate(var(--rotation));
  }
  to {
    transform: translateY(4px) rotate(calc(var(--rotation) + 2deg));
  }
}

@media (prefers-reduced-motion: reduce) {
  .word-chip {
    animation: none;
    transition: none;
    transform: rotate(var(--rotation));
  }
}
</style>
