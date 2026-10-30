<template>
  <v-snackbar
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :timeout="timeout"
    :color="color"
    :location="location"
    :vertical="vertical"
    :multi-line="multiLine"
  >
    <div class="d-flex align-center">
      <v-icon v-if="icon" start>{{ icon }}</v-icon>
      <span>{{ message }}</span>
    </div>

    <template v-slot:actions>
      <v-btn
        v-if="showClose"
        variant="text"
        @click="$emit('update:modelValue', false)"
      >
        Close
      </v-btn>
      <v-btn
        v-if="action"
        variant="text"
        @click="$emit('action')"
      >
        {{ actionText }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info', 'primary'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  timeout: {
    type: Number,
    default: 3000
  },
  location: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'].includes(value)
  },
  vertical: {
    type: Boolean,
    default: false
  },
  multiLine: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: true
  },
  action: {
    type: Boolean,
    default: false
  },
  actionText: {
    type: String,
    default: 'Action'
  }
});

defineEmits(['update:modelValue', 'action']);
</script>
