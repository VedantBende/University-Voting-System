<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-center max-w-md w-full">
      <!-- Loading Spinner -->
      <div class="mb-6">
        <v-progress-circular indeterminate color="primary" size="64" width="4"></v-progress-circular>
      </div>
      
      <!-- Status Message -->
      <h2 class="text-2xl font-semibold mb-2">{{ statusMessage }}</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ subMessage }}</p>

      <!-- Progress Steps -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div class="space-y-4">
          <!-- Step 1: Clerk Auth -->
          <div class="flex items-center gap-3">
            <v-icon v-if="currentStep >= 1" size="32" color="success">mdi-check-circle</v-icon>
            <v-progress-circular v-else indeterminate color="grey-lighten-1" size="32" width="2"></v-progress-circular>
            <span class="text-sm font-medium">Authenticating with Clerk</span>
          </div>

          <!-- Step 2: Check Database -->
          <div class="flex items-center gap-3">
            <v-icon v-if="currentStep >= 2 && userFound" size="32" color="success">mdi-check-circle</v-icon>
            <v-icon v-else-if="currentStep >= 2 && !userFound" size="32" color="error">mdi-close-circle</v-icon>
            <v-progress-circular v-else-if="currentStep === 1" indeterminate color="primary" size="32" width="3"></v-progress-circular>
            <v-icon v-else size="32" color="grey-lighten-1">mdi-circle-outline</v-icon>
            <span class="text-sm font-medium">Checking registration status</span>
          </div>

          <!-- Step 3: Redirect -->
          <div class="flex items-center gap-3">
            <v-icon v-if="currentStep >= 3" size="32" color="success">mdi-check-circle</v-icon>
            <v-progress-circular v-else-if="currentStep === 2" indeterminate color="primary" size="32" width="3"></v-progress-circular>
            <v-icon v-else size="32" color="grey-lighten-1">mdi-circle-outline</v-icon>
            <span class="text-sm font-medium">{{ redirectMessage }}</span>
          </div>
        </div>
      </div>

      <!-- Debug Info (Development Only) -->
      <div v-if="showDebug" class="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left text-xs">
        <p class="font-bold mb-2">Debug Info:</p>
        <p>User Found: {{ userFound }}</p>
        <p>Clerk User ID: {{ clerkUserId }}</p>
        <p>Email: {{ userEmail }}</p>
        <p>Current Step: {{ currentStep }}</p>
      </div>
    </div>

    <AuthenticateWithRedirectCallback />
  </div>
</template>

<script setup>
import { AuthenticateWithRedirectCallback, useAuth, useUser } from '@clerk/vue';
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/api';

const router = useRouter();
const { isSignedIn, userId } = useAuth();
const { user } = useUser();

const statusMessage = ref('Please wait...');
const subMessage = ref('Processing your authentication');
const currentStep = ref(0);
const userFound = ref(false);
const redirectMessage = ref('Preparing...');
const showDebug = ref(import.meta.env.DEV);
const clerkUserId = ref('');
const userEmail = ref('');

const checkDatabaseForUser = async () => {
  try {
    if (!user.value) {
      console.log('⏳ Waiting for Clerk user data...');
      return null;
    }

    currentStep.value = 2;
    statusMessage.value = 'Checking Registration...';
    subMessage.value = 'Looking up your account in our database';

    const email = user.value.emailAddresses[0]?.emailAddress;
    const clerkId = userId.value;
    
    userEmail.value = email || 'No email';
    clerkUserId.value = clerkId || 'No ID';

    console.log('🔍 Checking database for:', { email, clerkId });

    if (!email || !clerkId) {
      throw new Error('Missing email or Clerk ID');
    }

    const response = await api.post('/auth/check-user', {
      email: email,
      clerkId: clerkId
    });

    console.log('✅ API Response:', response.data);

    if (response.data.exists && response.data.registered) {
      console.log('✅ USER FOUND IN DATABASE');
      userFound.value = true;
      return 'found';
    } else {
      console.log('❌ USER NOT FOUND IN DATABASE');
      userFound.value = false;
      return 'not-found';
    }

  } catch (error) {
    console.error('❌ Database check error:', error);
    
    if (error.response?.status === 404) {
      console.log('❌ 404: USER NOT REGISTERED');
      userFound.value = false;
      return 'not-found';
    }
    
    return 'error';
  }
};

const handleAuthenticationComplete = async () => {
  if (!isSignedIn.value) return;

  currentStep.value = 1;
  statusMessage.value = 'Authenticated!';
  subMessage.value = 'Verifying your registration...';

  let attempts = 0;
  while (!user.value && attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 200));
    attempts++;
  }

  if (!user.value) {
    console.error('❌ Failed to load user data');
    statusMessage.value = 'Error';
    subMessage.value = 'Failed to load user data';
    setTimeout(() => router.push('/login'), 2000);
    return;
  }

  const result = await checkDatabaseForUser();
  currentStep.value = 3;

  if (result === 'found') {
    userFound.value = true;
    statusMessage.value = 'Welcome Back!';
    subMessage.value = 'Redirecting to elections...';
    redirectMessage.value = 'Redirecting to elections';
    
    console.log('✅ Redirecting to /elections');
    setTimeout(() => {
      router.push('/elections');
    }, 1500);

  } else if (result === 'not-found') {
    userFound.value = false;
    statusMessage.value = 'Registration Required';
    subMessage.value = 'Redirecting to registration page...';
    redirectMessage.value = 'Showing registration notice';
    
    console.log('❌ Redirecting to /user-not-found');
    setTimeout(() => {
      router.push('/user-not-found');
    }, 2000);

  } else {
    statusMessage.value = 'Something went wrong';
    subMessage.value = 'Redirecting to login...';
    redirectMessage.value = 'Retrying';
    
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }
};

watch(isSignedIn, (newValue) => {
  if (newValue) {
    console.log('✅ User signed in, starting verification');
    handleAuthenticationComplete();
  }
});

onMounted(() => {
  document.title = 'Signing In...';
  console.log('🚀 SSO Callback page mounted');
  
  if (isSignedIn.value) {
    handleAuthenticationComplete();
  }

  setTimeout(() => {
    if (currentStep.value < 3) {
      console.log('⏱️ Timeout reached, redirecting to login');
      router.push('/login');
    }
  }, 20000);
});
</script>
