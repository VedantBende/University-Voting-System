<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-block mb-4">
          <v-icon size="64" color="primary">mdi-school</v-icon>
        </router-link>
        <h1 class="text-3xl font-bold mb-2">Welcome Back</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Sign in to participate in university elections
        </p>
      </div>

      <!-- Email Restriction Notice for Sign In -->
      <div class="card bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 mb-6">
        <div class="card-body py-4">
          <div class="flex items-start gap-3">
            <v-icon size="32" color="amber" class="flex-shrink-0">mdi-alert</v-icon>
            <div>
              <h3 class="font-bold text-amber-900 dark:text-amber-100 mb-2">
                Authentication Notice
              </h3>
              <div class="space-y-2 text-sm">
                <p class="text-amber-800 dark:text-amber-200">
                  <strong>Only users with @ghru.edu.in email addresses can access this system.</strong>
                </p>
                <p class="text-amber-700 dark:text-amber-300 text-xs">
                  If you're trying to sign in with a different email domain, you will not be able to proceed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Clerk Sign In Component -->
      <div class="card">
        <div class="card-body">
          <SignIn 
            :appearance="signInAppearance"
            path="/login"
            routing="path"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
        <p class="mb-2">
          Don't have an account? 
          <router-link to="/signup" class="text-primary-600 hover:underline font-medium">
            Sign up with @ghru.edu.in
          </router-link>
        </p>
        <p>
          <router-link to="/" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <v-icon size="16">mdi-arrow-left</v-icon>
            Back to home
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SignIn } from '@clerk/vue';
import { onMounted } from 'vue';

// Clerk appearance customization
const signInAppearance = {
  elements: {
    rootBox: 'w-full',
    card: 'bg-transparent shadow-none',
    headerTitle: 'text-xl font-semibold',
    headerSubtitle: 'text-gray-600',
    formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white',
    formFieldInput: 'border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500',
    footerActionLink: 'text-primary-600 hover:text-primary-700'
  }
};

onMounted(() => {
  document.title = 'Login - University Voting System';
});
</script>

