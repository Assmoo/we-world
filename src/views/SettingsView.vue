<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import ToggleSwitch from '../components/ToggleSwitch.vue'
import { useWorldStore } from '../stores/world'

const store = useWorldStore()
const historyCount = computed(() => store.history.length)
</script>

<template>
  <div class="settings-view">
    <header class="settings-intro">
      <p class="eyebrow"><i></i> SETTINGS & PREFERENCES</p>
      <h1>把这里，<em>调成你喜欢的样子。</em></h1>
      <p>这个 Demo 先保留一些轻量设置。未来接入云端后，这里会成为我们共同空间的配置中心。</p>
    </header>

    <div class="settings-layout">
      <section class="settings-card">
        <header class="card-heading">
          <span class="card-number">01</span>
          <div>
            <p>DISPLAY</p>
            <h2>浏览偏好</h2>
          </div>
          <span class="heading-orbit" aria-hidden="true"></span>
        </header>

        <div class="setting-row">
          <div>
            <h3>相册自动轮播</h3>
            <p>让照片自己慢慢讲述那些时刻。</p>
          </div>
          <ToggleSwitch v-model="store.autoPlay" label="相册自动轮播" />
        </div>

        <div class="setting-row">
          <div>
            <h3>减少漂浮动效</h3>
            <p>关闭“他爱的 / 她爱的”词条循环漂浮。</p>
          </div>
          <ToggleSwitch v-model="store.reduceMotion" label="减少漂浮动效" />
        </div>
      </section>

      <section class="settings-card storage-card">
        <header class="card-heading">
          <span class="card-number">02</span>
          <div>
            <p>LOCAL STORAGE</p>
            <h2>本地数据</h2>
          </div>
          <span class="storage-status"><i></i> 正常</span>
        </header>

        <div class="storage-visual" aria-hidden="true">
          <span class="storage-ring"></span>
          <span class="storage-core">W</span>
          <span class="storage-dot dot-a"></span>
          <span class="storage-dot dot-b"></span>
        </div>

        <p class="storage-copy">
          留言、历史版本和喜欢词条目前只保存在当前浏览器中。更换设备或清理浏览器数据后不会自动同步。
        </p>

        <div class="storage-meta">
          <span>留言历史</span>
          <strong>{{ historyCount }} 条</strong>
        </div>
      </section>

      <section class="settings-card date-card">
        <header class="card-heading">
          <span class="card-number">03</span>
          <div>
            <p>OUR TIMELINE</p>
            <h2>故事起点</h2>
          </div>
        </header>

        <div class="date-display">
          <span>2026</span>
          <strong>08<small>.</small>11</strong>
          <p>从这一天起，计算在一起的第几天。</p>
        </div>
      </section>

      <section class="settings-card about-card">
        <span class="about-mark" aria-hidden="true">✦</span>
        <div>
          <p>ABOUT WE WORLD</p>
          <h2>一个只属于两个人的小小宇宙。</h2>
          <span>Demo v0.1 · Made with care</span>
        </div>
        <RouterLink class="back-link" to="/album">
          回到相册
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" />
          </svg>
        </RouterLink>
      </section>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  padding: 18px 3px 40px;
}

.settings-intro {
  padding: 2px 9px 27px;
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

.settings-intro h1 {
  margin: 17px 0 0;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: clamp(37px, 4.4vw, 61px);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.065em;
}

.settings-intro h1 em {
  color: var(--wine);
  font-weight: 400;
}

.settings-intro > p:last-child {
  max-width: 490px;
  margin: 17px 0 0;
  color: var(--muted);
  font-family: var(--font-serif);
  font-size: 12px;
  line-height: 1.9;
}

.settings-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.settings-card {
  position: relative;
  padding: 22px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 25px;
  background: rgba(255, 250, 245, 0.72);
  box-shadow: 0 16px 38px rgba(82, 53, 41, 0.055);
  backdrop-filter: blur(15px);
}

.card-heading {
  position: relative;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.card-number {
  display: grid;
  width: 25px;
  height: 25px;
  flex: 0 0 auto;
  border: 1px solid rgba(129, 78, 66, 0.12);
  border-radius: 50%;
  color: var(--coral);
  font-family: var(--font-display);
  font-size: 9px;
  font-style: italic;
  place-items: center;
}

.card-heading p,
.card-heading h2 {
  margin: 0;
}

.card-heading p {
  color: var(--coral);
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.card-heading h2 {
  margin-top: 5px;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 600;
}

.heading-orbit {
  position: absolute;
  top: -10px;
  right: -14px;
  width: 72px;
  height: 34px;
  border: 1px solid rgba(140, 82, 68, 0.08);
  border-radius: 50%;
  transform: rotate(-26deg);
}

.setting-row {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0;
  border-bottom: 1px solid rgba(118, 79, 65, 0.075);
}

.setting-row:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.setting-row h3,
.setting-row p {
  margin: 0;
}

.setting-row h3 {
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: 13px;
  font-weight: 600;
}

.setting-row p {
  margin-top: 5px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.55;
}

.storage-status {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  margin-left: auto;
  padding: 4px 8px;
  border-radius: 99px;
  color: #64805f;
  background: rgba(128, 157, 117, 0.1);
  font-size: 8px;
}

.storage-status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #7e9d74;
}

.storage-visual {
  position: relative;
  display: grid;
  width: 112px;
  height: 112px;
  margin: 19px auto 12px;
  place-items: center;
}

.storage-ring {
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(154, 91, 78, 0.15);
  border-radius: 50%;
}

.storage-ring::before,
.storage-ring::after {
  position: absolute;
  border: 1px solid rgba(154, 91, 78, 0.1);
  border-radius: 50%;
  content: '';
}

.storage-ring::before {
  inset: 13px -8px;
  transform: rotate(34deg);
}

.storage-ring::after {
  inset: -7px 18px;
  transform: rotate(-32deg);
}

.storage-core {
  display: grid;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  color: #fff8f1;
  background: linear-gradient(145deg, var(--wine), #a55a5e);
  font-family: var(--font-display);
  font-size: 20px;
  box-shadow: 0 10px 28px rgba(96, 42, 49, 0.17);
  place-items: center;
}

.storage-dot {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--coral);
}

.dot-a {
  top: 16px;
  right: 17px;
}

.dot-b {
  bottom: 21px;
  left: 11px;
  width: 3px;
  height: 3px;
  opacity: 0.6;
}

.storage-copy {
  margin: 0;
  color: var(--muted);
  font-family: var(--font-serif);
  font-size: 10px;
  line-height: 1.8;
  text-align: center;
}

.storage-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 17px;
  padding-top: 12px;
  border-top: 1px solid rgba(118, 79, 65, 0.075);
  color: var(--muted);
  font-size: 9px;
}

.storage-meta strong {
  color: var(--wine);
  font-weight: 600;
}

.date-card {
  background:
    radial-gradient(circle at 100% 0%, rgba(218, 142, 126, 0.14), transparent 38%),
    rgba(255, 250, 245, 0.72);
}

.date-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 22px 0 8px;
}

.date-display > span {
  color: var(--coral);
  font-family: var(--font-display);
  font-size: 13px;
  font-style: italic;
  letter-spacing: 0.23em;
}

.date-display > strong {
  margin-top: 3px;
  color: var(--wine);
  font-family: var(--font-display);
  font-size: 67px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.07em;
}

.date-display > strong small {
  margin: 0 4px;
  color: var(--rose);
  font-size: 38px;
}

.date-display p {
  margin: 9px 0 0;
  color: var(--muted);
  font-family: var(--font-serif);
  font-size: 10px;
}

.about-card {
  display: flex;
  grid-column: 1 / -1;
  gap: 18px;
  align-items: center;
  padding: 25px 27px;
  background:
    radial-gradient(circle at 0% 100%, rgba(208, 118, 107, 0.12), transparent 30%),
    rgba(255, 250, 245, 0.76);
}

.about-mark {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: 1px solid rgba(148, 84, 70, 0.12);
  border-radius: 50%;
  color: var(--rose);
  place-items: center;
}

.about-card p,
.about-card h2,
.about-card div > span {
  margin: 0;
}

.about-card p {
  color: var(--coral);
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.about-card h2 {
  margin-top: 5px;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 500;
}

.about-card div > span {
  display: block;
  margin-top: 5px;
  color: var(--muted);
  font-size: 8px;
  letter-spacing: 0.05em;
}

.back-link {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
  padding: 9px 13px;
  border: 1px solid rgba(118, 75, 61, 0.11);
  border-radius: 99px;
  color: var(--wine);
  background: rgba(255, 255, 255, 0.4);
  font-size: 9px;
  text-decoration: none;
  white-space: nowrap;
  transition:
    gap 0.2s ease,
    background 0.2s ease;
}

.back-link:hover {
  gap: 12px;
  background: #fff;
}

.back-link svg {
  width: 14px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.4;
}

@media (max-width: 750px) {
  .settings-intro {
    padding-right: 6px;
    padding-left: 6px;
  }

  .settings-intro h1 {
    font-size: clamp(33px, 9vw, 46px);
  }

  .settings-layout {
    grid-template-columns: 1fr;
  }

  .about-card {
    align-items: flex-start;
  }

  .back-link {
    display: none;
  }
}
</style>
