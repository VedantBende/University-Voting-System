<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 px-4">
    <div class="max-w-lg w-full">
      <!-- Main Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <!-- Icon -->
        <div class="mb-6">
          <div class="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <v-icon size="56" color="error">mdi-alert-circle</v-icon>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          User Not Found
        </h1>

        <!-- Description -->
        <p class="text-gray-600 dark:text-gray-400 mb-6 text-lg">
          We couldn't find an account associated with your email address in our database.
        </p>

        <!-- Email Display -->
        <div v-if="userEmail" class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Signed in as:</p>
          <p class="font-mono text-base font-semibold text-gray-900 dark:text-gray-100">
            {{ userEmail }}
          </p>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6 text-left">
          <div class="flex items-start gap-3">
            <v-icon size="24" color="info" class="flex-shrink-0">mdi-information</v-icon>
            <div>
              <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                What does this mean?
              </h3>
              <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li class="flex items-start gap-2">
                  <v-icon size="12" color="info">mdi-circle-small</v-icon>
                  <span>You've successfully signed in with Clerk authentication</span>
                </li>
                <li class="flex items-start gap-2">
                  <v-icon size="12" color="info">mdi-circle-small</v-icon>
                  <span>However, your account is not yet registered in our voting system</span>
                </li>
                <li class="flex items-start gap-2">
                  <v-icon size="12" color="info">mdi-circle-small</v-icon>
                  <span>You need to complete the sign-up process to access elections</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <router-link 
            to="/signup" 
            class="btn btn-primary btn-lg w-full flex items-center justify-center gap-2"
          >
            <v-icon size="20">mdi-account-plus</v-icon>
            <span>Complete Sign Up</span>
          </router-link>

          <button 
            @click="signOut"
            class="btn btn-ghost w-full"
          >
            Sign Out & Try Different Account
          </button>
        </div>

        <!-- Help Text -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact support at{' '}
            <a href="mailto:support@ghru.edu.in" class="text-primary-600 hover:underline">
              support@ghru.edu.in
            </a>
          </p>
        </div>
      </div>

      <!-- Additional Info Card -->
      <div class="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div class="flex items-start gap-3">
          <v-icon size="32" color="success">mdi-check-circle</v-icon>
          <div class="text-sm">
            <p class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Email Domain Verified
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              Your @ghru.edu.in email is valid. You just need to complete the registration process.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth, useUser, useClerk } from '@clerk/vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { isSignedIn } = useAuth();
const { user } = useUser();
const clerk = useClerk();

const userEmail = ref('');

const signOut = async () => {
  try {
    await clerk.signOut();
    router.push('/login');
  } catch (error) {
    console.error('Sign out error:', error);
  }
};

onMounted(() => {
  document.title = 'User Not Found - University Voting System';
  
  if (user.value) {
    userEmail.value = user.value.emailAddresses[0]?.emailAddress || '';
  }

  if (!isSignedIn.value) {
    router.push('/login');
  }
});
</script>
