<template>
  <div :class="['loader-container', { 'fullscreen': fullscreen }]">
    <v-progress-circular
      :indeterminate="indeterminate"
      :model-value="value"
      :size="size"
      :width="width"
      :color="color"
    ></v-progress-circular>
    
    <p v-if="text" class="text-body-1 mt-4">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  indeterminate: {
    type: Boolean,
    default: true
  },
  value: {
    type: Number,
    default: 0
  },
  size: {
    type: [String, Number],
    default: 64
  },
  width: {
    type: [String, Number],
    default: 4
  },
  color: {
    type: String,
    default: 'primary'
  },
  text: {
    type: String,
    default: ''
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loader-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}
</style>
