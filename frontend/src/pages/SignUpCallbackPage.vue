<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center max-w-md">
      <!-- Loading Spinner -->
      <div class="mb-6">
        <v-progress-circular indeterminate color="success" size="64" width="4"></v-progress-circular>
      </div>
      
      <!-- Message -->
      <h2 class="text-2xl font-semibold mb-2">{{ message }}</h2>
      <p class="text-gray-600 dark:text-gray-400">{{ subMessage }}</p>

      <!-- Progress Steps -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-left">
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <v-icon size="24" color="success">mdi-check-circle</v-icon>
            <span class="text-sm">Account created with Clerk</span>
          </div>
          
          <div class="flex items-center gap-3">
            <v-icon v-if="step >= 2" size="24" color="success">mdi-check-circle</v-icon>
            <v-progress-circular v-else indeterminate color="primary" size="24" width="3"></v-progress-circular>
            <span class="text-sm">Registering in voting system</span>
          </div>
          
          <div class="flex items-center gap-3">
            <v-icon v-if="step >= 3" size="24" color="success">mdi-check-circle</v-icon>
            <v-progress-circular v-else-if="step === 2" indeterminate color="primary" size="24" width="3"></v-progress-circular>
            <v-icon v-else size="24" color="grey-lighten-1">mdi-circle-outline</v-icon>
            <span class="text-sm">Redirecting to elections</span>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <v-icon color="error" size="20">mdi-alert-circle</v-icon>
          <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Clerk's AuthenticateWithRedirectCallback component -->
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

const message = ref('Completing Registration...');
const subMessage = ref('Setting up your account');
const step = ref(1);
const error = ref('');

const registerUser = async () => {
  try {
    if (!user.value) {
      console.log('Waiting for user data...');
      return false;
    }

    step.value = 2;
    message.value = 'Creating Your Profile...';
    subMessage.value = 'Syncing with database';

    const email = user.value.emailAddresses[0]?.emailAddress;
    
    if (!email) {
      throw new Error('No email address found');
    }

    const response = await api.post('/auth/sync', {
      clerkId: userId.value,
      email: email,
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      isNewUser: true
    });

    console.log('✅ User registered:', response.data);
    
    step.value = 3;
    message.value = 'Registration Complete!';
    subMessage.value = 'Redirecting to elections...';

    return true;
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err.response?.data?.error || err.message || 'Failed to complete registration';
    message.value = 'Registration Failed';
    subMessage.value = 'Please try again';
    return false;
  }
};

watch(isSignedIn, async (newValue) => {
  if (newValue && user.value) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = await registerUser();
    
    if (success) {
      setTimeout(() => {
        router.push('/elections');
      }, 1500);
    } else {
      setTimeout(() => {
        router.push('/signup');
      }, 3000);
    }
  }
});

onMounted(() => {
  document.title = 'Completing Registration - University Voting System';
  
  setTimeout(() => {
    if (step.value < 3) {
      console.log('Timeout: Redirecting to signup');
      router.push('/signup');
    }
  }, 15000);
});
</script>
