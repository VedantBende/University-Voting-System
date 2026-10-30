<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Navbar -->
    <nav class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container-custom py-4">
        <div class="flex items-center justify-between">
          <router-link to="/elections" class="flex items-center gap-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
            <v-icon size="20">mdi-arrow-left</v-icon>
            <span class="font-medium">Back to Elections</span>
          </router-link>
          <h1 class="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">My Profile</h1>
          <div class="w-28"></div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container-custom py-8">
      <!-- Loading State -->
      <div v-if="!isLoaded" class="text-center py-20">
        <div class="relative inline-flex">
          <v-progress-circular indeterminate color="primary" size="64" width="4" class="mx-auto mb-4"></v-progress-circular>
        </div>
        <p class="text-gray-600 dark:text-gray-400 animate-pulse">Loading your profile...</p>
      </div>

      <!-- Profile Content -->
      <div v-else-if="clerkUser" class="max-w-5xl mx-auto space-y-6">
        
        <!-- Hero Profile Card -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 p-8 text-white shadow-2xl">
          <div class="absolute inset-0 bg-grid-white/10"></div>
          <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div class="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              <img 
                :src="clerkUser.imageUrl" 
                :alt="clerkUser.fullName"
                class="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl transform group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
            </div>

            <div class="flex-1 text-center md:text-left">
              <h1 class="text-4xl font-bold mb-2 drop-shadow-lg">{{ clerkUser.fullName }}</h1>
              <p class="text-white/90 text-lg mb-4 flex items-center justify-center md:justify-start gap-2">
                <v-icon color="white" size="20">mdi-email</v-icon>
                {{ clerkUser.primaryEmailAddress?.emailAddress }}
              </p>
              
              <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p class="text-white/80 text-xs">Role</p>
                  <p class="text-white font-bold capitalize">
                    <v-icon size="16" start>mdi-school</v-icon>
                    {{ userRole }}
                  </p>
                </div>
                <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p class="text-white/80 text-xs">Member Since</p>
                  <p class="text-white font-bold">{{ formatDate(clerkUser.createdAt) }}</p>
                </div>
                <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p class="text-white/80 text-xs">Status</p>
                  <p class="text-white font-bold">
                    <v-icon size="16" start color="success">mdi-check-circle</v-icon>
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <v-icon size="32" color="white">mdi-vote</v-icon>
              </div>
              <div>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ votingStats.totalVotes }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Votes Cast</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <v-icon size="32" color="white">mdi-chart-bar</v-icon>
              </div>
              <div>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ votingStats.electionsParticipated }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Elections</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <v-icon size="32" color="white">mdi-trophy</v-icon>
              </div>
              <div>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ votingStats.engagementRate }}%</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Engagement</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Voting History -->
        <div v-if="votingHistory.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Voting Activity</h2>
          </div>
          <div class="p-6 space-y-3">
            <div v-for="vote in votingHistory.slice(0, 5)" :key="vote._id" 
                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ vote.electionTitle }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Position: {{ vote.position }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  <v-icon size="12">mdi-clock-outline</v-icon>
                  {{ formatDateTime(vote.votedAt) }}
                </p>
              </div>
              <v-icon size="32" color="success">mdi-check-circle</v-icon>
            </div>
          </div>
        </div>

        <!-- Account Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <v-icon size="24" color="primary">mdi-cog</v-icon>
              Account Settings
            </h2>
          </div>
          
          <div class="p-6 space-y-3">
            <button @click="clerk?.openUserProfile()" 
                    class="w-full group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl py-4 px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span class="relative flex items-center justify-between text-lg font-semibold">
                <span class="flex items-center gap-3">
                  <v-icon size="24">mdi-account-edit</v-icon>
                  Manage Account
                </span>
                <v-icon size="20">mdi-chevron-right</v-icon>
              </span>
            </button>

            <button @click="handleSignOut" 
                    class="w-full group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl py-4 px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span class="relative flex items-center justify-between text-lg font-semibold">
                <span class="flex items-center gap-3">
                  <v-icon size="24">mdi-logout</v-icon>
                  Sign Out
                </span>
                <v-icon size="20">mdi-chevron-right</v-icon>
              </span>
            </button>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Ready to Vote?</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">Participate in active elections and make your voice heard!</p>
            </div>
            <router-link to="/elections" class="btn btn-primary whitespace-nowrap">
              <v-icon size="18" start>mdi-vote</v-icon>
              Browse Elections
              <v-icon size="18" end>mdi-arrow-right</v-icon>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="max-w-2xl mx-auto text-center py-20">
        <v-icon size="96" color="warning" class="mb-4">mdi-alert-circle</v-icon>
        <h2 class="text-2xl font-bold mb-2">Unable to Load Profile</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Please try refreshing the page or sign in again.</p>
        <button @click="router.push('/login')" class="btn btn-primary">
          <v-icon size="18" start>mdi-login</v-icon>
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useClerk, useUser } from '@clerk/vue';

const router = useRouter();
const clerk = useClerk();
const { user: clerkUser, isLoaded } = useUser();

const votingHistory = ref([]);
const totalElections = ref(0);

const userRole = computed(() => {
  return clerkUser.value?.publicMetadata?.role || 'student';
});

const votingStats = computed(() => {
  const totalVotes = votingHistory.value.length;
  const electionsParticipated = new Set(votingHistory.value.map(v => v.electionId)).size;
  const engagementRate = totalElections.value > 0 
    ? Math.round((electionsParticipated / totalElections.value) * 100) 
    : 0;

  return { totalVotes, electionsParticipated, engagementRate };
});

const formatDate = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'N/A';
  }
};

const formatDateTime = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'N/A';
  }
};

const handleSignOut = async () => {
  if (confirm('Are you sure you want to sign out?')) {
    await clerk.value?.signOut();
    router.push('/login');
  }
};

onMounted(() => {
  console.log('ProfilePage mounted');
});
</script>

<style scoped>
.bg-grid-white {
  background-image: linear-gradient(white 1px, transparent 1px),
    linear-gradient(90deg, white 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
