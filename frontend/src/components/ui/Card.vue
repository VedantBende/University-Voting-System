<template>
  <v-card
    :elevation="elevation"
    :variant="variant"
    :hover="hover"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <!-- Image -->
    <v-img
      v-if="image"
      :src="image"
      :height="imageHeight"
      cover
    ></v-img>

    <!-- Title and Subtitle -->
    <v-card-title v-if="title || $slots.title">
      <slot name="title">{{ title }}</slot>
    </v-card-title>

    <v-card-subtitle v-if="subtitle || $slots.subtitle">
      <slot name="subtitle">{{ subtitle }}</slot>
    </v-card-subtitle>

    <!-- Content -->
    <v-card-text v-if="$slots.default">
      <slot></slot>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions v-if="$slots.actions">
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  imageHeight: {
    type: [String, Number],
    default: 200
  },
  elevation: {
    type: [String, Number],
    default: 2
  },
  variant: {
    type: String,
    default: 'elevated',
    validator: (value) => ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>
