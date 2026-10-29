<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AlbumPhoto } from '../types'
import { useWorldStore } from '../stores/world'

const props = defineProps<{
  photos: AlbumPhoto[]
}>()

const emit = defineEmits<{
  open: [index: number]
}>()

const store = useWorldStore()
const currentIndex = ref(0)
const isPaused = ref(false)
const cycleKey = ref(0)
let autoTimer: ReturnType<typeof setInterval> | null = null
let touchStartX = 0

const activePhoto = computed(() => props.photos[currentIndex.value])
const currentLabel = computed(() => String(currentIndex.value + 1).padStart(2, '0'))
const totalLabel = computed(() => String(props.photos.length).padStart(2, '0'))

function clearTimer(): void {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }
}

function scheduleAutoPlay(): void {
  clearTimer()
  if (!store.autoPlay || isPaused.value || props.photos.length < 2) return
  autoTimer = setInterval(() => goTo(currentIndex.value + 1), 5200)
}

function goTo(index: number): void {
  const total = props.photos.length
  if (!total) return
  currentIndex.value = (index + total) % total
  cycleKey.value += 1
  scheduleAutoPlay()
}

function previous(): void {
  goTo(currentIndex.value - 1)
}

function next(): void {
  goTo(currentIndex.value + 1)
}

function toggleAutoPlay(): void {
  store.autoPlay = !store.autoPlay
  scheduleAutoPlay()
}

function handlePointerDown(event: PointerEvent): void {
  if (event.pointerType !== 'mouse') touchStartX = event.clientX
}

function handlePointerUp(event: PointerEvent): void {
  if (!touchStartX || event.pointerType === 'mouse') return
  const distance = event.clientX - touchStartX
  touchStartX = 0
  if (Math.abs(distance) < 45) return
  if (distance > 0) previous()
  else next()
}

function pause(): void {
  isPaused.value = true
  scheduleAutoPlay()
}

function resume(): void {
  isPaused.value = false
  scheduleAutoPlay()
}

watch(() => [store.autoPlay, props.photos.length] as const, scheduleAutoPlay)
onMounted(scheduleAutoPlay)
onBeforeUnmount(clearTimer)
</script>

<template>
  <section
    class="carousel-card"
    aria-roledescription="carousel"
    aria-label="我们的相册轮播"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <div
      class="carousel-stage"
      @pointerdown="handlePointerDown"
      @pointerup="handlePointerUp"
    >
      <Transition name="photo-fade" mode="out-in">
        <article :key="activePhoto.id" class="carousel-slide">
          <img :src="activePhoto.src" :alt="activePhoto.title" />
          <div class="blind-curtain" aria-hidden="true">
            <i v-for="index in 10" :key="index" :style="{ '--i': index - 1 }"></i>
          </div>
          <div class="slide-shade" aria-hidden="true"></div>

          <div class="slide-topline">
            <span class="slide-tag">{{ activePhoto.tag }}</span>
            <span class="slide-number">{{ currentLabel }} <i>/</i> {{ totalLabel }}</span>
          </div>

          <div class="slide-copy">
            <p>{{ activePhoto.date }} · {{ activePhoto.location }}</p>
            <h2>{{ activePhoto.title }}</h2>
            <blockquote>{{ activePhoto.note }}</blockquote>
            <button class="expand-button" type="button" @click="emit('open', currentIndex)">
              <span>打开这一刻</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </button>
          </div>
        </article>
      </Transition>

      <button class="carousel-arrow arrow-prev" type="button" aria-label="上一张" @click="previous">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m15 5-7 7 7 7" />
        </svg>
      </button>
      <button class="carousel-arrow arrow-next" type="button" aria-label="下一张" @click="next">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>
    </div>

    <footer class="carousel-footer">
      <div class="progress-track" aria-hidden="true">
        <span
          v-if="store.autoPlay && !isPaused"
          :key="cycleKey"
          class="progress-fill"
          :style="{ animationDuration: '5.2s' }"
        ></span>
      </div>

      <div class="carousel-bottom">
        <div class="carousel-dots" role="tablist" aria-label="选择照片">
          <button
            v-for="(photo, index) in photos"
            :key="photo.id"
            class="dot"
            :class="{ active: currentIndex === index }"
            type="button"
            role="tab"
            :aria-selected="currentIndex === index"
            :aria-label="`查看第 ${index + 1} 张：${photo.title}`"
            @click="goTo(index)"
          ></button>
        </div>

        <div class="carousel-tools">
          <span>{{ isPaused ? '已暂停' : '自动播放' }}</span>
          <button type="button" :aria-label="store.autoPlay ? '暂停自动轮播' : '开始自动轮播'" @click="toggleAutoPlay">
            <svg v-if="store.autoPlay" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="7" y="5" width="3.5" height="14" rx="1" />
              <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="m8 5 11 7-11 7V5Z" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.carousel-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 30px;
  background: rgba(255, 250, 245, 0.78);
  box-shadow: 0 25px 60px rgba(82, 51, 40, 0.09);
}

.carousel-stage {
  position: relative;
  min-height: 388px;
  overflow: hidden;
  border-radius: 29px 29px 18px 18px;
  touch-action: pan-y;
}

.carousel-slide {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.carousel-slide > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
  animation: slowZoom 8s ease-out both;
}

.slide-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(36, 22, 20, 0.05) 0%, rgba(36, 22, 20, 0.04) 31%, rgba(32, 18, 18, 0.72) 100%),
    linear-gradient(90deg, rgba(32, 18, 18, 0.23), transparent 60%);
}

.slide-topline {
  position: absolute;
  z-index: 4;
  top: 21px;
  right: 22px;
  left: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slide-tag {
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 99px;
  color: rgba(255, 252, 247, 0.86);
  background: rgba(45, 25, 22, 0.16);
  font-size: 9px;
  letter-spacing: 0.08em;
  backdrop-filter: blur(8px);
}

.slide-number {
  color: rgba(255, 252, 247, 0.78);
  font-family: var(--font-display);
  font-size: 11px;
  font-style: italic;
  letter-spacing: 0.08em;
}

.slide-number i {
  margin: 0 4px;
  color: rgba(255, 255, 255, 0.35);
  font-style: normal;
}

.slide-copy {
  position: absolute;
  z-index: 3;
  right: clamp(28px, 6vw, 62px);
  bottom: 33px;
  left: clamp(28px, 6vw, 62px);
  max-width: 560px;
  color: #fff8f2;
}

.slide-copy p,
.slide-copy h2,
.slide-copy blockquote {
  margin: 0;
}

.slide-copy > p {
  color: rgba(255, 247, 239, 0.66);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.slide-copy h2 {
  max-width: 470px;
  margin-top: 10px;
  font-family: var(--font-serif);
  font-size: clamp(27px, 3vw, 42px);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.04em;
  text-wrap: balance;
  text-shadow: 0 4px 20px rgba(31, 16, 15, 0.16);
}

.slide-copy blockquote {
  max-width: 390px;
  margin-top: 11px;
  color: rgba(255, 247, 239, 0.69);
  font-family: var(--font-serif);
  font-size: 11px;
  line-height: 1.75;
}

.expand-button {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  margin-top: 18px;
  padding: 8px 2px;
  border: 0;
  border-bottom: 1px solid rgba(255, 247, 239, 0.35);
  color: #fff8f2;
  background: transparent;
  font-family: var(--font-serif);
  font-size: 10px;
  cursor: pointer;
  transition: gap 0.2s ease;
}

.expand-button:hover {
  gap: 11px;
}

.expand-button svg {
  width: 15px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.4;
}

.carousel-arrow {
  position: absolute;
  z-index: 5;
  top: 50%;
  display: grid;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.19);
  border-radius: 50%;
  color: rgba(255, 251, 246, 0.84);
  background: rgba(43, 24, 21, 0.16);
  cursor: pointer;
  backdrop-filter: blur(9px);
  place-items: center;
  transform: translateY(-50%);
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.carousel-arrow:hover {
  background: rgba(43, 24, 21, 0.35);
  transform: translateY(-50%) scale(1.04);
}

.carousel-arrow svg {
  width: 17px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.arrow-prev {
  left: 18px;
}

.arrow-next {
  right: 18px;
}

.carousel-footer {
  padding: 0 22px 14px;
}

.progress-track {
  height: 1px;
  overflow: hidden;
  background: rgba(114, 76, 62, 0.09);
}

.progress-fill {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--coral), var(--rose));
  transform-origin: left;
  animation: progressGrow linear both;
}

.carousel-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
}

.carousel-dots {
  display: flex;
  gap: 5px;
  align-items: center;
}

.dot {
  width: 5px;
  height: 5px;
  padding: 0;
  border: 0;
  border-radius: 99px;
  background: rgba(110, 78, 66, 0.2);
  cursor: pointer;
  transition:
    width 0.3s ease,
    background 0.3s ease;
}

.dot.active {
  width: 21px;
  background: var(--wine);
}

.carousel-tools {
  display: flex;
  gap: 7px;
  align-items: center;
  color: rgba(103, 75, 64, 0.45);
  font-size: 8px;
}

.carousel-tools button {
  display: grid;
  width: 25px;
  height: 25px;
  padding: 0;
  border: 1px solid rgba(112, 75, 62, 0.1);
  border-radius: 50%;
  color: var(--wine);
  background: transparent;
  cursor: pointer;
  place-items: center;
}

.carousel-tools svg {
  width: 11px;
  height: 11px;
}

.blind-curtain {
  position: absolute;
  z-index: 2;
  inset: 0;
  display: flex;
  pointer-events: none;
}

.blind-curtain i {
  width: 10%;
  height: 100%;
  background:
    linear-gradient(90deg, rgba(42, 25, 22, 0.26), rgba(255, 255, 255, 0.08)),
    rgba(116, 73, 59, 0.13);
  transform-origin: bottom;
  transform: scaleY(0);
}

.photo-fade-enter-active,
.photo-fade-leave-active {
  transition: opacity 0.32s ease;
}

.photo-fade-enter-from,
.photo-fade-leave-to {
  opacity: 0;
}

.photo-fade-enter-active .blind-curtain i {
  animation: blindLift 0.78s cubic-bezier(0.76, 0, 0.24, 1) both;
  animation-delay: calc(var(--i) * 45ms);
}

.photo-fade-enter-active .slide-copy,
.photo-fade-enter-active .slide-topline {
  animation: copyReveal 0.8s 0.36s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes blindLift {
  0% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0);
  }
}

@keyframes copyReveal {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slowZoom {
  from {
    transform: scale(1.06);
  }
  to {
    transform: scale(1);
  }
}

@keyframes progressGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@media (max-width: 1180px) {
  .carousel-stage {
    min-height: min(55vw, 480px);
  }
}

@media (max-width: 700px) {
  .carousel-card {
    border-radius: 25px;
  }

  .carousel-stage {
    min-height: 390px;
    border-radius: 24px 24px 16px 16px;
  }

  .slide-copy {
    right: 24px;
    bottom: 27px;
    left: 24px;
  }

  .slide-copy h2 {
    font-size: 31px;
  }

  .slide-copy blockquote {
    max-width: 290px;
    font-size: 10px;
  }

  .carousel-arrow {
    width: 32px;
    height: 32px;
  }

  .arrow-prev {
    left: 12px;
  }

  .arrow-next {
    right: 12px;
  }
}

@media (max-width: 430px) {
  .carousel-stage {
    min-height: 355px;
  }

  .slide-copy h2 {
    font-size: 28px;
  }

  .slide-copy > p {
    font-size: 8px;
  }
}
</style>
