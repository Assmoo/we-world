<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarNav from './components/SidebarNav.vue'
import DayCounter from './components/DayCounter.vue'
import DailyNote from './components/DailyNote.vue'
import FavoritesPanel from './components/FavoritesPanel.vue'
</script>

<template>
  <div class="ambient ambient-one" aria-hidden="true"></div>
  <div class="ambient ambient-two" aria-hidden="true"></div>
  <div class="paper-noise" aria-hidden="true"></div>

  <div class="app-shell">
    <SidebarNav />

    <main class="center-column">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <aside class="right-column" aria-label="我们的日常">
      <DayCounter />
      <DailyNote />
      <FavoritesPanel />
    </aside>
  </div>
</template>
