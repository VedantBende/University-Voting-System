<template>
  <v-card
    class="text-center"
    elevation="2"
    hover
  >
    <v-card-text>
      <div class="d-flex flex-column align-center ga-2">
        <!-- Icon/Emoji -->
        <div class="text-h3">{{ icon }}</div>
        
        <!-- Value -->
        <div class="text-h4 font-weight-bold text-primary">
          {{ value }}
        </div>
        
        <!-- Label -->
        <div class="text-subtitle-1 text-medium-emphasis">
          {{ label }}
        </div>
        
        <!-- Optional Description -->
        <div v-if="description" class="text-caption text-medium-emphasis mt-1">
          {{ description }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '📊'
  },
  value: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});
</script>
