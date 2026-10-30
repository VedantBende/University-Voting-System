<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :max-width="maxWidth"
    :persistent="persistent"
    :scrollable="scrollable"
    :fullscreen="fullscreen"
  >
    <v-card>
      <!-- Header -->
      <v-card-title v-if="title || $slots.title" class="d-flex align-center justify-space-between">
        <slot name="title">
          <span>{{ title }}</span>
        </slot>
        <v-btn
          v-if="showClose"
          icon="mdi-close"
          variant="text"
          @click="$emit('update:modelValue', false)"
        ></v-btn>
      </v-card-title>

      <v-divider v-if="title || $slots.title"></v-divider>

      <!-- Content -->
      <v-card-text :class="contentClass">
        <slot></slot>
      </v-card-text>

      <v-divider v-if="$slots.actions"></v-divider>

      <!-- Actions -->
      <v-card-actions v-if="$slots.actions">
        <v-spacer></v-spacer>
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: [String, Number],
    default: 600
  },
  persistent: {
    type: Boolean,
    default: false
  },
  scrollable: {
    type: Boolean,
    default: false
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: true
  },
  contentClass: {
    type: String,
    default: 'py-4'
  }
});

defineEmits(['update:modelValue']);
</script>
