<template>
  <v-btn
    :icon="theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
    variant="text"
    @click="toggleTheme"
  >
    <v-icon>{{ theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
    <v-tooltip activator="parent" location="bottom">
      {{ theme.global.current.value.dark ? 'Light Mode' : 'Dark Mode' }}
    </v-tooltip>
  </v-btn>
</template>

<script setup>
import { useTheme } from 'vuetify';

const theme = useTheme();

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
  localStorage.setItem('theme', theme.global.name.value);
};

// Load saved theme on mount
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  theme.global.name.value = savedTheme;
}
</script>
