<template>
  <div class="min-h-screen">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="w-full px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-2 text-xl font-bold">
            <img src="/assets/logo.png" alt="Logo" class="h-12 w-auto object-contain" />
            <span>GH Raisoni University Voting System</span>
          </router-link>

          <div class="flex items-center gap-4">
            <template v-if="isSignedIn">
              <router-link to="/elections" class="btn btn-ghost">
                Elections
              </router-link>
              <UserButton />
            </template>
            <template v-else>
              <router-link to="/login" class="btn btn-ghost">
                Sign In
              </router-link>
              <router-link to="/signup" class="btn btn-primary">
                Sign Up
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section with Background Image -->
    <section class="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 overflow-hidden">
      <!-- Background Image with More Blur -->
      <div class="absolute inset-0 bg-cover bg-center opacity-75 blur-md" 
           style="background-image: url('/assets/hero-bg.png')"></div>
      
      <!-- Content with Text Shadow -->
      <div class="container-custom text-center relative z-10">
        <h1 class="text-5xl font-bold mb-4" style="text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.8);">
          <v-icon size="56" color="white" class="mr-2">mdi-school</v-icon>
          University Voting System
        </h1>
        <p class="text-xl mb-8 text-primary-100" style="text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);">
          Secure, Anonymous, and Transparent Elections for GHRU
        </p>
        <div class="flex gap-4 justify-center">
          <template v-if="isSignedIn">
            <router-link to="/elections" class="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
              <v-icon size="20" start color="primary">mdi-vote</v-icon>
              View Elections
            </router-link>
          </template>
          <template v-else>
            <router-link to="/signup" class="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
              <v-icon size="20" start color="primary">mdi-rocket-launch</v-icon>
              Get Started
            </router-link>
            <router-link to="/login" class="btn btn-lg btn-outline border-white text-white hover:bg-white/10">
              <v-icon size="20" start>mdi-login</v-icon>
              Sign In
            </router-link>
          </template>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section">
      <div class="container-custom">
        <h2 class="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="card card-body text-center">
            <v-icon size="64" color="primary" class="mb-4">mdi-shield-lock</v-icon>
            <h3 class="text-xl font-semibold mb-2">Secure Authentication</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Login with your @ghru.edu.in email via Clerk authentication
            </p>
          </div>

          <div class="card card-body text-center">
            <v-icon size="64" color="primary" class="mb-4">mdi-vote</v-icon>
            <h3 class="text-xl font-semibold mb-2">Anonymous Voting</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Your vote is encrypted and cannot be traced back to you
            </p>
          </div>

          <div class="card card-body text-center">
            <v-icon size="64" color="primary" class="mb-4">mdi-chart-bar</v-icon>
            <h3 class="text-xl font-semibold mb-2">Real-time Results</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Results are automatically revealed when elections end
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="section bg-gray-100 dark:bg-gray-800">
      <div class="container-custom">
        <div class="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">100%</div>
            <div class="text-gray-600 dark:text-gray-400">
              <v-icon size="20">mdi-shield-check</v-icon>
              Secure
            </div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">24/7</div>
            <div class="text-gray-600 dark:text-gray-400">
              <v-icon size="20">mdi-clock-outline</v-icon>
              Available
            </div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">0</div>
            <div class="text-gray-600 dark:text-gray-400">
              <v-icon size="20">mdi-file-cancel</v-icon>
              Paper Waste
            </div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">∞</div>
            <div class="text-gray-600 dark:text-gray-400">
              <v-icon size="20">mdi-thumb-up</v-icon>
              Convenience
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-8">
      <div class="container-custom text-center">
        <p>&copy; 2025 GHRU University Voting System. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth, UserButton } from '@clerk/vue';

const { isSignedIn } = useAuth();

onMounted(() => {
  document.title = 'Home - University Voting System';
});
</script>
