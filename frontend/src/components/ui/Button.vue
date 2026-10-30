<template>
  <v-btn
    :color="color"
    :variant="variant"
    :size="size"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :loading="loading"
    :disabled="disabled"
    :block="block"
    :rounded="rounded"
    @click="$emit('click', $event)"
  >
    <slot>{{ text }}</slot>
  </v-btn>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'primary'
  },
  variant: {
    type: String,
    default: 'flat',
    validator: (value) => ['flat', 'outlined', 'text', 'elevated', 'tonal', 'plain'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(value)
  },
  prependIcon: {
    type: String,
    default: ''
  },
  appendIcon: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: [String, Boolean],
    default: false
  }
});

defineEmits(['click']);
</script>
