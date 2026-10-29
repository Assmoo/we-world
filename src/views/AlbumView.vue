<script setup lang="ts">
import { computed, ref } from 'vue'
import AlbumCarousel from '../components/AlbumCarousel.vue'
import Lightbox from '../components/Lightbox.vue'
import { albumPhotos } from '../utils/album'
import { formatToday } from '../utils/date'

const lightboxIndex = ref<number | null>(null)
const todayLabel = computed(() => formatToday())

function openPhoto(index: number): void {
  lightboxIndex.value = index
}
</script>

<template>
  <div class="album-view">
    <header class="album-intro">
      <div class="intro-topline">
        <p class="eyebrow"><i></i> OUR LITTLE ARCHIVE</p>
        <span class="intro-date">{{ todayLabel }}</span>
      </div>
      <div class="intro-title-row">
        <h1>把喜欢的日子，<br /><em>慢慢收集起来。</em></h1>
        <span class="intro-symbol" aria-hidden="true">
          <i></i>
          <i></i>
        </span>
      </div>
      <p class="intro-copy">照片会褪色，但那天的心情不会。这里收着我们一路走过的光影。</p>
    </header>

    <AlbumCarousel :photos="albumPhotos" @open="openPhoto" />

    <section class="gallery-section" aria-labelledby="gallery-title">
      <header class="gallery-header">
        <div>
          <p class="eyebrow">ALL THE LITTLE THINGS</p>
          <h2 id="gallery-title">我们的瞬间</h2>
        </div>
        <div class="gallery-count">
          <strong>{{ String(albumPhotos.length).padStart(2, '0') }}</strong>
          <span>moments<br />collected</span>
        </div>
      </header>

      <div class="gallery-grid">
        <button
          v-for="(photo, index) in albumPhotos"
          :key="photo.id"
          class="gallery-item"
          type="button"
          @click="openPhoto(index)"
        >
          <img :src="photo.src" :alt="photo.title" loading="lazy" />
          <div class="gallery-shade"></div>
          <span class="gallery-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="gallery-caption">
            <span>{{ photo.date }} · {{ photo.tag }}</span>
            <h3>{{ photo.title }}</h3>
          </div>
          <span class="gallery-open" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </button>
      </div>
    </section>

    <section class="closing-note">
      <span class="closing-line" aria-hidden="true"></span>
      <p>“有些瞬间不必完美，<br />只要我们在同一张照片里。”</p>
      <span class="closing-mark" aria-hidden="true">✦</span>
      <small>TO BE CONTINUED</small>
    </section>

    <Lightbox
      v-if="lightboxIndex !== null"
      :photos="albumPhotos"
      :index="lightboxIndex"
      @close="lightboxIndex = null"
      @update:index="lightboxIndex = $event"
    />
  </div>
</template>

<style scoped>
.album-view {
  padding: 18px 2px 40px;
}

.album-intro {
  padding: 2px 9px 28px;
}

.intro-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eyebrow {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0;
  color: var(--coral);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.eyebrow i {
  width: 23px;
  height: 1px;
  background: currentColor;
  opacity: 0.45;
}

.intro-date {
  color: var(--muted);
  font-family: var(--font-serif);
  font-size: 10px;
}

.intro-title-row {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 17px;
}

.album-intro h1 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: clamp(38px, 4.6vw, 66px);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -0.065em;
  text-wrap: balance;
}

.album-intro h1 em {
  color: var(--wine);
  font-weight: 400;
}

.intro-symbol {
  position: relative;
  width: 76px;
  height: 76px;
  flex: 0 0 auto;
  margin: 5px 4px 0 18px;
  opacity: 0.7;
}

.intro-symbol::before,
.intro-symbol::after {
  position: absolute;
  border: 1px solid rgba(147, 80, 70, 0.21);
  border-radius: 50%;
  content: '';
}

.intro-symbol::before {
  inset: 10px 0;
  transform: rotate(31deg);
}

.intro-symbol::after {
  inset: 0 10px;
  transform: rotate(-31deg);
}

.intro-symbol i {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--coral);
  box-shadow: 0 0 0 7px rgba(195, 98, 91, 0.07);
  transform: translate(-50%, -50%);
}

.intro-copy {
  max-width: 470px;
  margin: 18px 0 0;
  color: var(--muted);
  font-family: var(--font-serif);
  font-size: 12px;
  line-height: 1.9;
}

.gallery-section {
  margin-top: 36px;
}

.gallery-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 9px 15px;
}

.gallery-header .eyebrow {
  color: var(--muted);
  font-size: 8px;
}

.gallery-header h2 {
  margin: 7px 0 0;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: 25px;
  font-weight: 500;
  letter-spacing: -0.04em;
}

.gallery-count {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.gallery-count strong {
  color: var(--wine);
  font-family: var(--font-display);
  font-size: 31px;
  font-weight: 400;
  line-height: 0.9;
}

.gallery-count span {
  color: var(--muted);
  font-size: 7px;
  line-height: 1.4;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.gallery-grid {
  column-count: 3;
  column-gap: 11px;
}

.gallery-item {
  position: relative;
  display: block;
  width: 100%;
  min-height: 180px;
  margin: 0 0 11px;
  padding: 0;
  overflow: hidden;
  break-inside: avoid;
  border: 1px solid rgba(255, 255, 255, 0.58);
  border-radius: 20px;
  background: #d8c2b3;
  box-shadow: 0 12px 28px rgba(89, 57, 45, 0.06);
  cursor: pointer;
  aspect-ratio: 1.15;
}

.gallery-item:nth-child(3n + 2) {
  aspect-ratio: 1.35;
}

.gallery-item:nth-child(4n + 3) {
  aspect-ratio: 0.96;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery-item:hover img {
  transform: scale(1.045);
}

.gallery-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(33, 19, 17, 0.03) 25%, rgba(33, 19, 17, 0.72) 100%);
  opacity: 0.74;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-shade {
  opacity: 0.92;
}

.gallery-index {
  position: absolute;
  top: 13px;
  left: 14px;
  color: rgba(255, 250, 245, 0.76);
  font-family: var(--font-display);
  font-size: 9px;
  font-style: italic;
  letter-spacing: 0.08em;
}

.gallery-caption {
  position: absolute;
  right: 14px;
  bottom: 14px;
  left: 14px;
  color: #fff7ef;
  text-align: left;
}

.gallery-caption span {
  color: rgba(255, 246, 237, 0.58);
  font-size: 7px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.gallery-caption h3 {
  margin: 5px 0 0;
  overflow: hidden;
  font-family: var(--font-serif);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gallery-open {
  position: absolute;
  top: 11px;
  right: 11px;
  display: grid;
  width: 27px;
  height: 27px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #fff8f2;
  background: rgba(38, 21, 18, 0.17);
  opacity: 0;
  backdrop-filter: blur(5px);
  place-items: center;
  transform: translateY(4px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.gallery-item:hover .gallery-open {
  opacity: 1;
  transform: translateY(0);
}

.gallery-open svg {
  width: 13px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.4;
}

.closing-note {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 43px 20px 8px;
  color: var(--muted);
  text-align: center;
}

.closing-line {
  width: 35px;
  height: 1px;
  margin-bottom: 20px;
  background: rgba(126, 81, 67, 0.18);
}

.closing-note p {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: 16px;
  line-height: 1.9;
}

.closing-mark {
  margin-top: 16px;
  color: var(--rose);
  font-size: 12px;
}

.closing-note small {
  margin-top: 8px;
  font-size: 7px;
  letter-spacing: 0.2em;
}

@media (max-width: 900px) {
  .gallery-grid {
    column-count: 2;
  }
}

@media (max-width: 700px) {
  .album-view {
    padding-top: 15px;
  }

  .album-intro {
    padding: 2px 6px 23px;
  }

  .intro-title-row {
    margin-top: 14px;
  }

  .album-intro h1 {
    font-size: clamp(34px, 10vw, 48px);
  }

  .intro-symbol {
    width: 54px;
    height: 54px;
  }

  .intro-copy {
    max-width: 330px;
    margin-top: 14px;
    font-size: 11px;
  }

  .gallery-section {
    margin-top: 28px;
  }

  .gallery-header {
    padding-right: 6px;
    padding-left: 6px;
  }

  .gallery-grid {
    column-gap: 9px;
  }

  .gallery-item {
    margin-bottom: 9px;
    border-radius: 17px;
  }
}

@media (max-width: 450px) {
  .intro-date {
    display: none;
  }

  .intro-symbol {
    width: 45px;
    height: 45px;
    margin-right: 0;
  }

  .gallery-count {
    display: none;
  }
}
</style>
