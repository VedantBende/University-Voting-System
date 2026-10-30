<template>
  <v-app-bar elevation="1" color="surface" app>
    <v-container fluid class="d-flex align-center px-4">
      <!-- Logo and Title -->
      <router-link 
        to="/" 
        class="d-flex align-center text-decoration-none mr-4"
        style="flex-shrink: 0;"
      >
        <!-- Rectangle Logo with fallback icon -->
        <div class="logo-container mr-3">
          <v-img
            src="/assets/logo.png"
            alt="GHRU Logo"
            height="40"
            width="auto"
            max-width="120"
            contain
            @error="onImageError"
          >
            <template v-slot:error>
              <div class="d-flex align-center justify-center h-100">
                <v-icon size="40" color="primary">mdi-school</v-icon>
              </div>
            </template>
          </v-img>
        </div>
        
        <!-- Title (Desktop) -->
        <div class="d-none d-lg-block">
          <span class="text-h6 font-weight-bold text-primary">
            GHRU Voting System
          </span>
        </div>
        
        <!-- Title (Tablet) -->
        <div class="d-none d-md-block d-lg-none">
          <span class="text-subtitle-1 font-weight-bold text-primary">
            GHRU Voting
          </span>
        </div>
      </router-link>

      <v-spacer></v-spacer>

      <!-- Desktop Navigation -->
      <div class="d-none d-md-flex align-center ga-2">
        <v-btn
          to="/elections"
          variant="text"
          color="primary"
          prepend-icon="mdi-vote"
        >
          Elections
        </v-btn>
        
        <v-btn
          v-if="isAdmin"
          to="/admin"
          variant="text"
          color="primary"
          prepend-icon="mdi-shield-crown"
        >
          Admin
        </v-btn>

        <DarkModeToggle />

        <template v-if="isSignedIn">
          <UserButton />
        </template>
        <template v-else>
          <v-btn
            to="/login"
            variant="text"
            color="primary"
          >
            Sign In
          </v-btn>
          <v-btn
            to="/signup"
            color="primary"
            variant="flat"
          >
            Sign Up
          </v-btn>
        </template>
      </div>

      <!-- Mobile Menu -->
      <div class="d-flex d-md-none align-center ga-2">
        <DarkModeToggle />
        <v-app-bar-nav-icon 
          @click="drawer = !drawer"
          aria-label="Open navigation menu"
        ></v-app-bar-nav-icon>
      </div>
    </v-container>
  </v-app-bar>

  <!-- Mobile Drawer -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="right"
    width="280"
  >
    <v-list density="comfortable" nav>
      <!-- User Section (if signed in) -->
      <template v-if="isSignedIn && user">
        <v-list-item class="py-4">
          <div class="d-flex align-center ga-3">
            <v-avatar size="40">
              <v-img :src="user.imageUrl" :alt="user.fullName"></v-img>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-subtitle-2 font-weight-medium">{{ user.fullName }}</div>
              <div class="text-caption text-medium-emphasis text-truncate">{{ user.primaryEmailAddress?.emailAddress }}</div>
            </div>
          </div>
        </v-list-item>
        <v-divider class="my-2"></v-divider>
      </template>

      <!-- Navigation Items -->
      <v-list-item
        to="/elections"
        prepend-icon="mdi-vote"
        title="Elections"
        value="elections"
      ></v-list-item>
      
      <v-list-item
        v-if="isAdmin"
        to="/admin"
        prepend-icon="mdi-shield-crown"
        title="Admin Dashboard"
        value="admin"
      ></v-list-item>

      <v-list-item
        v-if="isSignedIn"
        to="/profile"
        prepend-icon="mdi-account"
        title="My Profile"
        value="profile"
      ></v-list-item>

      <v-divider class="my-2"></v-divider>

      <!-- Auth Actions -->
      <template v-if="!isSignedIn">
        <v-list-item
          to="/login"
          prepend-icon="mdi-login"
          title="Sign In"
          value="login"
        ></v-list-item>
        <v-list-item
          to="/signup"
          prepend-icon="mdi-account-plus"
          title="Sign Up"
          value="signup"
        ></v-list-item>
      </template>
      <template v-else>
        <v-list-item
          @click="handleSignOut"
          prepend-icon="mdi-logout"
          title="Sign Out"
          value="signout"
        ></v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth, useUser, useClerk, UserButton } from '@clerk/vue';
import DarkModeToggle from './DarkModeToggle.vue';

const router = useRouter();
const { isSignedIn, sessionClaims } = useAuth();
const { user } = useUser();
const clerk = useClerk();
const drawer = ref(false);

const isAdmin = computed(() => {
  return sessionClaims.value?.metadata?.role === 'admin';
});

const onImageError = (error) => {
  console.warn('Logo image failed to load:', error);
};

const handleSignOut = async () => {
  if (confirm('Are you sure you want to sign out?')) {
    await clerk.value?.signOut();
    drawer.value = false;
    router.push('/');
  }
};
</script>

<style scoped>
.logo-container {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
}
</style>
