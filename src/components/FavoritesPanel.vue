<script setup lang="ts">
import { useWorldStore } from '../stores/world'
import FavoriteCloud from './FavoriteCloud.vue'

const store = useWorldStore()
</script>

<template>
  <section class="favorites-section" aria-labelledby="favorites-title">
    <header class="section-header">
      <div>
        <p>LITTLE LOVES</p>
        <h2 id="favorites-title">我们各自的小喜欢</h2>
      </div>
      <span class="section-mark" aria-hidden="true">✦</span>
    </header>

    <div class="favorites-grid">
      <FavoriteCloud
        side="his"
        title="他爱的"
        eyebrow="HIS FAVORITES"
        tone="rose"
        :words="store.hisWords"
      />
      <FavoriteCloud
        side="her"
        title="她爱的"
        eyebrow="HER FAVORITES"
        tone="sage"
        :words="store.herWords"
      />
    </div>
  </section>
</template>

<style scoped>
.favorites-section {
  padding: 2px 0 10px;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 4px 10px;
}

.section-header p,
.section-header h2 {
  margin: 0;
}

.section-header p {
  color: var(--coral);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.section-header h2 {
  margin-top: 4px;
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 600;
}

.section-mark {
  color: rgba(190, 112, 100, 0.55);
  font-size: 16px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

@media (max-width: 360px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>
