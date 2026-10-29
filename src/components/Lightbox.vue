<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AlbumPhoto } from '../types'

const props = defineProps<{
  photos: AlbumPhoto[]
  index: number
}>()

const emit = defineEmits<{
  close: []
  'update:index': [index: number]
}>()

const activeIndex = ref(props.index)
const activePhoto = computed(() => props.photos[activeIndex.value])
let previousOverflow = ''

function close(): void {
  emit('close')
}

function goTo(index: number): void {
  const total = props.photos.length
  activeIndex.value = (index + total) % total
  emit('update:index', activeIndex.value)
}

function previous(): void {
  goTo(activeIndex.value - 1)
}

function next(): void {
  goTo(activeIndex.value + 1)
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') close()
  if (event.key === 'ArrowLeft') previous()
  if (event.key === 'ArrowRight') next()
}

watch(
  () => props.index,
  (value) => {
    activeIndex.value = value
  },
)

onMounted(() => {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox" appear>
      <div class="lightbox-overlay" @click.self="close">
        <section class="lightbox" role="dialog" aria-modal="true" :aria-label="activePhoto.title">
          <button class="lightbox-close" type="button" aria-label="关闭大图" @click="close">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>

          <div class="lightbox-visual">
            <Transition name="lightbox-image" mode="out-in">
              <img :key="activePhoto.id" :src="activePhoto.src" :alt="activePhoto.title" />
            </Transition>
            <span class="lightbox-count">
              {{ String(activeIndex + 1).padStart(2, '0') }}
              <i>/</i>
              {{ String(photos.length).padStart(2, '0') }}
            </span>
          </div>

          <div class="lightbox-copy">
            <p>{{ activePhoto.date }} · {{ activePhoto.location }}</p>
            <h2>{{ activePhoto.title }}</h2>
            <blockquote>{{ activePhoto.note }}</blockquote>

            <div class="lightbox-controls">
              <button type="button" aria-label="上一张" @click="previous">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m15 5-7 7 7 7" />
                </svg>
              </button>
              <div class="thumbnail-strip">
                <button
                  v-for="(photo, index) in photos"
                  :key="photo.id"
                  type="button"
                  :class="{ active: activeIndex === index }"
                  :aria-label="`查看 ${photo.title}`"
                  @click="goTo(index)"
                >
                  <img :src="photo.src" alt="" />
                </button>
              </div>
              <button type="button" aria-label="下一张" @click="next">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-overlay {
  position: fixed;
  z-index: 120;
  inset: 0;
  display: grid;
  padding: 24px;
  background: rgba(33, 18, 16, 0.69);
  backdrop-filter: blur(14px);
  place-items: center;
}

.lightbox {
  position: relative;
  display: grid;
  width: min(1060px, 100%);
  max-height: min(780px, 91dvh);
  grid-template-columns: minmax(0, 1.55fr) minmax(290px, 0.8fr);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 30px;
  background: #2b1c1a;
  box-shadow: 0 40px 120px rgba(15, 8, 7, 0.5);
}

.lightbox-close {
  position: absolute;
  z-index: 5;
  top: 16px;
  right: 16px;
  display: grid;
  width: 37px;
  height: 37px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  color: #fff8f1;
  background: rgba(31, 18, 16, 0.25);
  cursor: pointer;
  backdrop-filter: blur(8px);
  place-items: center;
}

.lightbox-close svg {
  width: 17px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.5;
}

.lightbox-visual {
  position: relative;
  min-height: 620px;
  overflow: hidden;
  background: #221513;
}

.lightbox-visual::after {
  position: absolute;
  inset: auto 0 0;
  height: 26%;
  background: linear-gradient(transparent, rgba(21, 12, 11, 0.25));
  content: '';
  pointer-events: none;
}

.lightbox-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lightbox-count {
  position: absolute;
  z-index: 2;
  bottom: 19px;
  left: 22px;
  color: rgba(255, 249, 243, 0.76);
  font-family: var(--font-display);
  font-size: 11px;
  font-style: italic;
  letter-spacing: 0.08em;
}

.lightbox-count i {
  margin: 0 4px;
  color: rgba(255, 255, 255, 0.3);
  font-style: normal;
}

.lightbox-copy {
  display: flex;
  flex-direction: column;
  padding: 75px 32px 28px;
  color: #fff5ed;
}

.lightbox-copy > p,
.lightbox-copy > h2,
.lightbox-copy > blockquote {
  margin: 0;
}

.lightbox-copy > p {
  color: rgba(255, 242, 233, 0.48);
  font-size: 9px;
  letter-spacing: 0.12em;
}

.lightbox-copy h2 {
  margin-top: 12px;
  font-family: var(--font-serif);
  font-size: 31px;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.04em;
}

.lightbox-copy blockquote {
  margin-top: 16px;
  color: rgba(255, 242, 233, 0.58);
  font-family: var(--font-serif);
  font-size: 12px;
  line-height: 1.9;
}

.lightbox-controls {
  display: flex;
  gap: 9px;
  align-items: center;
  margin-top: auto;
  padding-top: 30px;
}

.lightbox-controls > button {
  display: grid;
  width: 31px;
  height: 31px;
  flex: 0 0 auto;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  color: rgba(255, 246, 238, 0.72);
  background: transparent;
  cursor: pointer;
  place-items: center;
}

.lightbox-controls svg {
  width: 14px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.thumbnail-strip {
  display: flex;
  gap: 5px;
  flex: 1;
  overflow: hidden;
}

.thumbnail-strip button {
  width: 30px;
  height: 38px;
  flex: 0 0 auto;
  padding: 0;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  opacity: 0.43;
  transition:
    opacity 0.2s ease,
    border-color 0.2s ease;
}

.thumbnail-strip button.active {
  border-color: rgba(255, 255, 255, 0.52);
  opacity: 1;
}

.thumbnail-strip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-active .lightbox,
.lightbox-leave-active .lightbox {
  transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-from .lightbox,
.lightbox-leave-to .lightbox {
  transform: translateY(20px) scale(0.975);
}

.lightbox-image-enter-active,
.lightbox-image-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.35s ease;
}

.lightbox-image-enter-from,
.lightbox-image-leave-to {
  opacity: 0;
  transform: scale(1.015);
}

@media (max-width: 800px) {
  .lightbox-overlay {
    padding: 10px;
  }

  .lightbox {
    max-height: 93dvh;
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) auto;
    border-radius: 24px;
  }

  .lightbox-visual {
    min-height: 0;
  }

  .lightbox-copy {
    padding: 21px 22px 20px;
  }

  .lightbox-copy h2 {
    margin-top: 8px;
    font-size: 23px;
  }

  .lightbox-copy blockquote {
    margin-top: 10px;
    font-size: 11px;
  }

  .lightbox-controls {
    padding-top: 18px;
  }
}
</style>
