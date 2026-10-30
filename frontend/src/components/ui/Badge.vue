<template>
  <v-chip
    :color="color"
    :variant="variant"
    :size="size"
    :prepend-icon="icon"
    :closable="closable"
    @click:close="$emit('close')"
  >
    <slot>{{ text }}</slot>
  </v-chip>
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
    validator: (value) => ['flat', 'outlined', 'text', 'elevated', 'tonal'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);
</script>
