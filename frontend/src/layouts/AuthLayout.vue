<template>
  <v-app>
    <v-main class="d-flex align-center justify-center" style="min-height: 100vh;">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4">
            <!-- Logo and Title -->
            <div class="text-center mb-8">
              <router-link to="/" class="text-decoration-none">
                <v-img
                  src="/assets/logo.png"
                  alt="GHRU Logo"
                  width="80"
                  height="80"
                  class="mx-auto mb-4"
                ></v-img>
                <h1 class="text-h4 font-weight-bold text-primary mb-2">
                  GH Raisoni University
                </h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Voting System
                </p>
              </router-link>
            </div>

            <!-- Auth Content -->
            <v-card elevation="8" rounded="lg">
              <v-card-text class="pa-6 pa-sm-8">
                <router-view />
              </v-card-text>
            </v-card>

            <!-- Footer Links -->
            <div class="text-center mt-6">
              <p class="text-body-2 text-medium-emphasis">
                &copy; {{ currentYear }} GH Raisoni University
              </p>
              <div class="mt-2">
                <router-link to="/" class="text-decoration-none text-primary text-body-2 mx-2">
                  Home
                </router-link>
                <span class="text-medium-emphasis">•</span>
                <a href="#" class="text-decoration-none text-primary text-body-2 mx-2">
                  Help
                </a>
                <span class="text-medium-emphasis">•</span>
                <a href="#" class="text-decoration-none text-primary text-body-2 mx-2">
                  Contact
                </a>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.v-main {
  background: linear-gradient(135deg, #0891B2 0%, #06B6D4 100%);
}
</style>
