<template>
  <v-card variant="tonal" :color="color" class="pa-3">
    <div class="d-flex align-center justify-center ga-2">
      <v-icon>{{ icon }}</v-icon>
      <div class="text-center">
        <div class="text-caption text-medium-emphasis mb-1">{{ label }}</div>
        <div class="text-h6 font-weight-bold">
          <span v-if="days > 0">{{ days }}d </span>
          <span>{{ hours }}h </span>
          <span>{{ minutes }}m </span>
          <span>{{ seconds }}s</span>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  endTime: {
    type: [String, Date],
    required: true
  },
  label: {
    type: String,
    default: 'Time Remaining'
  }
});

const emit = defineEmits(['ended']);

const timeRemaining = ref(0);
let intervalId = null;

const days = computed(() => Math.floor(timeRemaining.value / (1000 * 60 * 60 * 24)));
const hours = computed(() => Math.floor((timeRemaining.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
const minutes = computed(() => Math.floor((timeRemaining.value % (1000 * 60 * 60)) / (1000 * 60)));
const seconds = computed(() => Math.floor((timeRemaining.value % (1000 * 60)) / 1000));

const color = computed(() => {
  if (timeRemaining.value <= 0) return 'error';
  if (hours.value < 1) return 'warning';
  if (days.value < 1) return 'info';
  return 'success';
});

const icon = computed(() => {
  if (timeRemaining.value <= 0) return 'mdi-clock-alert';
  if (hours.value < 1) return 'mdi-clock-fast';
  return 'mdi-clock-outline';
});

const updateTimer = () => {
  const now = new Date().getTime();
  const end = new Date(props.endTime).getTime();
  const difference = end - now;

  if (difference <= 0) {
    timeRemaining.value = 0;
    clearInterval(intervalId);
    emit('ended');
  } else {
    timeRemaining.value = difference;
  }
};

onMounted(() => {
  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>
