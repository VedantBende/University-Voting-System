<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :rules="rules"
    :prepend-icon="prependIcon"
    :prepend-inner-icon="prependInnerIcon"
    :append-icon="appendIcon"
    :append-inner-icon="appendInnerIcon"
    :hint="hint"
    :persistent-hint="persistentHint"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :variant="variant"
    :density="density"
    :error-messages="errorMessages"
  ></v-text-field>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  rules: {
    type: Array,
    default: () => []
  },
  prependIcon: {
    type: String,
    default: ''
  },
  prependInnerIcon: {
    type: String,
    default: ''
  },
  appendIcon: {
    type: String,
    default: ''
  },
  appendInnerIcon: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  persistentHint: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'outlined',
    validator: (value) => ['outlined', 'filled', 'solo', 'plain', 'underlined'].includes(value)
  },
  density: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'comfortable', 'compact'].includes(value)
  },
  errorMessages: {
    type: [String, Array],
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>
