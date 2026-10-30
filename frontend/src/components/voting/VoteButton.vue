<template>
  <v-btn
    :color="buttonColor"
    :variant="variant"
    :size="size"
    :block="block"
    :loading="loading"
    :disabled="disabled || hasVoted"
    :prepend-icon="buttonIcon"
    @click="handleClick"
  >
    {{ buttonText }}
  </v-btn>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'flat'
  },
  size: {
    type: String,
    default: 'large'
  },
  block: {
    type: Boolean,
    default: false
  },
  confirmRequired: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['click', 'confirm']);

const buttonText = computed(() => {
  if (props.loading) return 'Casting Vote...';
  if (props.hasVoted) return 'Already Voted';
  return 'Cast Vote';
});

const buttonColor = computed(() => {
  if (props.hasVoted) return 'success';
  return 'primary';
});

const buttonIcon = computed(() => {
  if (props.hasVoted) return 'mdi-check-circle';
  if (props.loading) return '';
  return 'mdi-vote';
});

const handleClick = () => {
  if (props.confirmRequired) {
    emit('confirm');
  } else {
    emit('click');
  }
};
</script>
