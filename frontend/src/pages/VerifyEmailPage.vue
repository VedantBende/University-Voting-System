<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <div class="max-w-md w-full">
      <div class="card">
        <div class="card-body text-center py-12">
          <v-icon size="96" color="primary" class="mb-6">mdi-email-check</v-icon>
          
          <h1 class="text-3xl font-bold mb-4">Verify Your Email</h1>
          
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            We've sent a verification code to your email address. Please check your inbox and enter the code below.
          </p>

          <!-- Clerk's built-in email verification component -->
          <div class="clerk-verification">
            <SignUp 
              :appearance="{
                elements: {
                  rootBox: 'mx-auto',
                  card: 'shadow-none'
                }
              }"
            />
          </div>

          <div class="mt-6 text-sm text-gray-500">
            <p class="mb-2">Didn't receive the email?</p>
            <button @click="resendEmail" class="text-primary-600 hover:underline">
              <v-icon size="16" start>mdi-email-sync</v-icon>
              Resend verification email
            </button>
          </div>

          <div class="mt-6 pt-6 border-t">
            <router-link to="/login" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              <v-icon size="16" start>mdi-arrow-left</v-icon>
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SignUp } from '@clerk/vue';

const resendEmail = () => {
  alert('Verification email resent! Please check your inbox.');
};
</script>
