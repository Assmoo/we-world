<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <button
    class="toggle-switch"
    :class="{ active: modelValue }"
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span></span>
  </button>
</template>

<style scoped>
.toggle-switch {
  position: relative;
  width: 42px;
  height: 24px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 99px;
  background: rgba(106, 79, 68, 0.16);
  cursor: pointer;
  transition: background 0.25s ease;
}

.toggle-switch span {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fffdf9;
  box-shadow: 0 2px 8px rgba(79, 53, 42, 0.18);
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.toggle-switch.active {
  background: var(--wine);
}

.toggle-switch.active span {
  transform: translateX(18px);
}
</style>
