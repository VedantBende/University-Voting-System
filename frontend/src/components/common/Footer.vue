<template>
  <v-footer class="bg-grey-darken-4 text-white mt-auto">
    <v-container>
      <v-row class="py-8">
        <!-- About Section with Rectangle Logo -->
        <v-col cols="12" md="4" class="mb-4 mb-md-0">
          <!-- Rectangle Logo with fallback -->
          <div class="d-flex align-center mb-3">
            <div class="logo-container mr-2">
              <v-img
                src="/assets/logo.png"
                alt="GHRU Logo"
                height="32"
                width="auto"
                max-width="100"
                contain
                @error="onImageError"
              >
                <template v-slot:error>
                  <div class="d-flex align-center justify-center h-100">
                    <v-icon size="32" color="white">mdi-school</v-icon>
                  </div>
                </template>
              </v-img>
            </div>
          </div>
          
          <h3 class="text-h6 font-weight-bold mb-2">GHRU Voting System</h3>
          <p class="text-body-2 text-grey-lighten-1 mb-3">
            Secure, anonymous, and transparent online voting system for university elections.
          </p>
          
          <!-- Social Media Links -->
          <div class="d-flex ga-2">
            <v-btn
              icon
              variant="outlined"
              size="small"
              href="https://facebook.com/ghru"
              target="_blank"
              aria-label="Facebook"
            >
              <v-icon size="20">mdi-facebook</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="outlined"
              size="small"
              href="https://twitter.com/ghru"
              target="_blank"
              aria-label="Twitter"
            >
              <v-icon size="20">mdi-twitter</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="outlined"
              size="small"
              href="https://instagram.com/ghru"
              target="_blank"
              aria-label="Instagram"
            >
              <v-icon size="20">mdi-instagram</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="outlined"
              size="small"
              href="https://linkedin.com/company/ghru"
              target="_blank"
              aria-label="LinkedIn"
            >
              <v-icon size="20">mdi-linkedin</v-icon>
            </v-btn>
          </div>
        </v-col>

        <!-- Quick Links -->
        <v-col cols="12" md="4" class="mb-4 mb-md-0">
          <h3 class="text-h6 font-weight-bold mb-3">Quick Links</h3>
          <v-list density="compact" class="bg-transparent pa-0">
            <v-list-item
              v-for="link in quickLinks"
              :key="link.to"
              :to="link.to"
              class="text-body-2 px-0 text-grey-lighten-1 hover-text-white"
              :prepend-icon="link.icon"
              min-height="32"
            >
              {{ link.text }}
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Contact Info -->
        <v-col cols="12" md="4">
          <h3 class="text-h6 font-weight-bold mb-3">Contact Us</h3>
          <v-list density="compact" class="bg-transparent pa-0">
            <v-list-item class="text-body-2 px-0 mb-2" min-height="32">
              <template v-slot:prepend>
                <v-icon size="20" class="mr-2">mdi-email</v-icon>
              </template>
              <a href="mailto:voting@ghru.edu.in" class="text-grey-lighten-1 text-decoration-none hover-text-white">
                voting@ghru.edu.in
              </a>
            </v-list-item>
            <v-list-item class="text-body-2 px-0 mb-2" min-height="32">
              <template v-slot:prepend>
                <v-icon size="20" class="mr-2">mdi-phone</v-icon>
              </template>
              <span class="text-grey-lighten-1">+91 1234567890</span>
            </v-list-item>
            <v-list-item class="text-body-2 px-0 mb-2" min-height="32">
              <template v-slot:prepend>
                <v-icon size="20" class="mr-2">mdi-web</v-icon>
              </template>
              <a href="https://www.ghru.edu.in" target="_blank" class="text-grey-lighten-1 text-decoration-none hover-text-white">
                www.ghru.edu.in
              </a>
            </v-list-item>
            <v-list-item class="text-body-2 px-0" min-height="32">
              <template v-slot:prepend>
                <v-icon size="20" class="mr-2">mdi-map-marker</v-icon>
              </template>
              <span class="text-grey-lighten-1">Amravati, Maharashtra, India</span>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <!-- Divider -->
      <v-divider class="border-opacity-25 mb-4"></v-divider>

      <!-- Bottom Bar -->
      <v-row dense>
        <v-col cols="12" md="6" class="text-center text-md-start mb-2 mb-md-0">
          <p class="text-body-2 text-grey-lighten-1 mb-0">
            &copy; {{ currentYear }} GH Raisoni University. All rights reserved.
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-end">
          <div class="d-flex justify-center justify-md-end align-center ga-2">
            <v-icon size="16" color="success">mdi-shield-check</v-icon>
            <span class="text-body-2 text-grey-lighten-1">
              Secured with SHA-256 encryption
            </span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
import { computed } from 'vue';
import { useAuth } from '@clerk/vue';

const { sessionClaims } = useAuth();
const currentYear = new Date().getFullYear();

const isAdmin = computed(() => {
  return sessionClaims.value?.metadata?.role === 'admin';
});

const quickLinks = computed(() => {
  const baseLinks = [
    { text: 'Home', to: '/', icon: 'mdi-home' },
    { text: 'Elections', to: '/elections', icon: 'mdi-vote' },
    { text: 'About Us', to: '/about', icon: 'mdi-information' },
    { text: 'Privacy Policy', to: '/privacy', icon: 'mdi-shield-lock' },
  ];
  
  if (isAdmin.value) {
    baseLinks.push({ text: 'Admin Dashboard', to: '/admin', icon: 'mdi-shield-crown' });
  }
  
  return baseLinks;
});

const onImageError = (error) => {
  console.warn('Footer logo image failed to load:', error);
};
</script>

<style scoped>
.hover-text-white:hover {
  color: white !important;
}

.logo-container {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
}
</style>
