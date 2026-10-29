<script setup lang="ts">
import { computed } from 'vue'
import { daysTogether, formatDayNumber, formatToday, RELATIONSHIP_START } from '../utils/date'

const days = computed(() => daysTogether())
const today = computed(() => formatToday())
const startLabel = `${RELATIONSHIP_START.year}.${String(RELATIONSHIP_START.month).padStart(2, '0')}.${String(RELATIONSHIP_START.day).padStart(2, '0')}`
</script>

<template>
  <section class="day-card" aria-labelledby="day-card-title">
    <div class="day-glow" aria-hidden="true"></div>
    <div class="orbit orbit-one" aria-hidden="true"></div>
    <div class="orbit orbit-two" aria-hidden="true"></div>
    <span class="orbit-dot dot-one" aria-hidden="true"></span>
    <span class="orbit-dot dot-two" aria-hidden="true"></span>

    <div class="day-heading">
      <p class="eyebrow">OUR LITTLE TIMELINE</p>
      <span class="today-label">{{ today }}</span>
    </div>

    <div id="day-card-title" class="day-number">
      <span>DAY</span>
      <strong>{{ formatDayNumber(days) }}</strong>
    </div>

    <div class="day-copy">
      <p>在一起的第 <strong>{{ days }}</strong> 天</p>
      <span>日子还长，我们慢慢写。</span>
    </div>

    <div class="day-footer">
      <span>始于</span>
      <time :datetime="`${RELATIONSHIP_START.year}-08-11`">{{ startLabel }}</time>
      <i aria-hidden="true"></i>
      <span>未完待续</span>
    </div>
  </section>
</template>

<style scoped>
.day-card {
  position: relative;
  min-height: 222px;
  padding: 23px 23px 19px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 28px;
  color: #fbefe7;
  background:
    radial-gradient(circle at 82% 22%, rgba(240, 152, 138, 0.26), transparent 29%),
    linear-gradient(145deg, #6d2938 0%, #4a1e2a 56%, #2e141b 100%);
  box-shadow: 0 22px 52px rgba(61, 24, 32, 0.2);
  isolation: isolate;
}

.day-card::after {
  position: absolute;
  right: -57px;
  bottom: -74px;
  width: 175px;
  height: 175px;
  border: 1px solid rgba(255, 233, 223, 0.12);
  border-radius: 50%;
  content: '';
}

.day-glow {
  position: absolute;
  top: -80px;
  right: -60px;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: rgba(225, 126, 117, 0.13);
  filter: blur(28px);
}

.day-heading,
.day-number,
.day-copy,
.day-footer {
  position: relative;
  z-index: 2;
}

.day-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.eyebrow {
  margin: 0;
  color: rgba(255, 239, 230, 0.52);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.2em;
}

.today-label {
  color: rgba(255, 239, 230, 0.65);
  font-family: var(--font-serif);
  font-size: 10px;
}

.day-number {
  display: flex;
  align-items: flex-end;
  margin-top: 14px;
}

.day-number span {
  margin: 0 8px 15px 0;
  color: rgba(255, 239, 230, 0.38);
  font-family: var(--font-display);
  font-size: 10px;
  font-style: italic;
  letter-spacing: 0.16em;
}

.day-number strong {
  font-family: var(--font-display);
  font-size: clamp(60px, 5.3vw, 78px);
  font-weight: 400;
  line-height: 0.8;
  letter-spacing: -0.08em;
  text-shadow: 0 9px 34px rgba(0, 0, 0, 0.13);
}

.day-copy {
  margin-top: 15px;
}

.day-copy p {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 15px;
  letter-spacing: 0.05em;
}

.day-copy p strong {
  color: #ffd6c9;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
}

.day-copy > span {
  display: block;
  margin-top: 5px;
  color: rgba(255, 239, 230, 0.52);
  font-family: var(--font-serif);
  font-size: 11px;
}

.day-footer {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 19px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 239, 230, 0.11);
  color: rgba(255, 239, 230, 0.4);
  font-size: 8px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.day-footer time {
  color: rgba(255, 239, 230, 0.67);
}

.day-footer i {
  width: 3px;
  height: 3px;
  margin: 0 2px;
  border-radius: 50%;
  background: #e99c91;
}

.orbit {
  position: absolute;
  z-index: 1;
  border: 1px solid rgba(255, 237, 228, 0.1);
  border-radius: 50%;
  pointer-events: none;
}

.orbit-one {
  top: 38px;
  right: -35px;
  width: 130px;
  height: 58px;
  transform: rotate(-26deg);
}

.orbit-two {
  top: 20px;
  right: -12px;
  width: 98px;
  height: 38px;
  border-color: rgba(255, 237, 228, 0.06);
  transform: rotate(38deg);
}

.orbit-dot {
  position: absolute;
  z-index: 2;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #f4b3a5;
  box-shadow: 0 0 0 4px rgba(244, 179, 165, 0.07);
}

.dot-one {
  top: 47px;
  right: 42px;
}

.dot-two {
  top: 82px;
  right: 100px;
  width: 3px;
  height: 3px;
  opacity: 0.55;
}
</style>
