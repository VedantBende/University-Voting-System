<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :permanent="permanent"
    :rail="rail"
    @click="rail = false"
  >
    <v-list>
      <!-- Header -->
      <v-list-item
        v-if="!rail"
        :prepend-avatar="userAvatar"
        :title="userName"
        :subtitle="userRole"
      >
        <template v-slot:append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Navigation Items -->
      <v-list-item
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.text"
        :value="item.to"
        color="primary"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  modelValue: Boolean,
  permanent: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    required: true
  },
  userName: {
    type: String,
    default: 'User'
  },
  userRole: {
    type: String,
    default: 'Admin'
  },
  userAvatar: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);

const rail = ref(false);
</script>
