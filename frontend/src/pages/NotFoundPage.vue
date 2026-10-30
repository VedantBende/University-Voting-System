<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
    <div class="max-w-lg w-full text-center">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <div class="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          404
        </div>
        <v-icon size="96" color="grey-lighten-1" class="mb-4">mdi-magnify</v-icon>
      </div>

      <!-- Content -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Page Not Found
        </h1>
        
        <p class="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <!-- Suggestions -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8 text-left">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Here are some helpful links:
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/" class="text-primary-600 hover:underline flex items-center gap-2">
                <v-icon size="18">mdi-home</v-icon>
                <span>Go to Home Page</span>
              </router-link>
            </li>
            <li>
              <router-link to="/elections" class="text-primary-600 hover:underline flex items-center gap-2">
                <v-icon size="18">mdi-vote</v-icon>
                <span>View Active Elections</span>
              </router-link>
            </li>
            <li>
              <router-link to="/profile" class="text-primary-600 hover:underline flex items-center gap-2">
                <v-icon size="18">mdi-account</v-icon>
                <span>My Profile</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            @click="$router.back()" 
            class="btn btn-secondary"
          >
            <v-icon size="18" start>mdi-arrow-left</v-icon>
            Go Back
          </button>
          <router-link 
            to="/" 
            class="btn btn-primary"
          >
            <v-icon size="18" start>mdi-home</v-icon>
            Home Page
          </router-link>
        </div>
      </div>

      <!-- Additional Info -->
      <p class="mt-6 text-sm text-gray-500 dark:text-gray-400">
        If you believe this is an error, please contact support at{' '}
        <a href="mailto:support@ghru.edu.in" class="text-primary-600 hover:underline">
          support@ghru.edu.in
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  document.title = '404 - Page Not Found';
});
</script>
