<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-block mb-4">
          <v-icon size="64" color="primary">mdi-school</v-icon>
        </router-link>
        <h1 class="text-3xl font-bold mb-2">Create Your Account</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Join the university voting system
        </p>
      </div>

      <!-- Email Restriction Notice -->
      <div class="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 mb-6">
        <div class="card-body py-4">
          <div class="flex items-start gap-3">
            <v-icon size="32" color="primary" class="flex-shrink-0">mdi-lock</v-icon>
            <div>
              <h3 class="font-bold text-blue-900 dark:text-blue-100 mb-2">
                Email Restriction Policy
              </h3>
              <div class="space-y-2 text-sm">
                <p class="text-blue-800 dark:text-blue-200">
                  <strong>Only @ghru.edu.in emails are allowed</strong>
                </p>
                <ul class="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1">
                  <li>
                    <v-icon size="14" color="success">mdi-check</v-icon>
                    Valid: student@ghru.edu.in
                  </li>
                  <li>
                    <v-icon size="14" color="error">mdi-close</v-icon>
                    Invalid: student@gmail.com
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Clerk Sign Up Component -->
      <div class="card">
        <div class="card-body">
          <SignUp 
            :appearance="signUpAppearance"
            path="/signup"
            routing="path"
            :afterSignUpUrl="afterSignUpUrl"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
        <p class="mb-2">
          Already have an account? 
          <router-link to="/login" class="text-primary-600 hover:underline font-medium">
            Sign in
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
import { SignUp } from '@clerk/vue';
import { onMounted } from 'vue';

const afterSignUpUrl = '/signup/sso-callback';

const signUpAppearance = {
  elements: {
    rootBox: 'w-full',
    card: 'bg-transparent shadow-none',
    headerTitle: 'text-xl font-semibold',
    headerSubtitle: 'text-gray-600',
    formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white',
    formFieldInput: 'border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500',
    footerActionLink: 'text-primary-600 hover:text-primary-700',
    formFieldLabel: 'text-gray-700 dark:text-gray-300'
  }
};

onMounted(() => {
  document.title = 'Sign Up - University Voting System';
});
</script>
