<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div class="container-custom py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-2 text-xl font-bold">
            <v-icon size="32" color="primary">mdi-school</v-icon>
            <span>Voting System</span>
          </router-link>
          <div class="flex items-center gap-4">
            <router-link to="/elections" class="font-medium text-primary-600">
              Elections
            </router-link>
            <router-link to="/profile" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              Profile
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container-custom py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Active Elections</h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          Browse and participate in ongoing university elections
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64" class="mx-auto mb-4"></v-progress-circular>
        <p class="text-gray-600 dark:text-gray-400">Loading elections...</p>
      </div>

      <!-- Elections Grid -->
      <div v-else-if="elections.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="election in elections" :key="election._id" class="card card-hover">
          <div class="card-body">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-semibold mb-1">{{ election.title }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ election.category.replace('_', ' ') }}</p>
              </div>
              <span :class="getStatusBadgeClass(election.status)">
                {{ election.status }}
              </span>
            </div>

            <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
              {{ election.description || 'No description provided' }}
            </p>

            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>
                <v-icon size="16">mdi-calendar-clock</v-icon>
                {{ getTimeRemaining(election) }}
              </span>
              <span>
                <v-icon size="16">mdi-account-group</v-icon>
                {{ election.totalVotes || 0 }} votes
              </span>
            </div>

            <!-- Actions -->
            <div v-if="election.status === 'active'">
              <router-link 
                :to="`/elections/${election._id}/vote`" 
                class="btn btn-primary w-full"
              >
                <v-icon size="18" start>mdi-vote</v-icon>
                View Candidates & Vote
              </router-link>
            </div>
            <div v-else-if="election.status === 'ended'">
              <router-link 
                :to="`/elections/${election._id}/results`" 
                class="btn btn-outline w-full"
              >
                <v-icon size="18" start>mdi-chart-bar</v-icon>
                View Results
              </router-link>
            </div>
            <div v-else>
              <button disabled class="btn btn-secondary w-full">
                <v-icon size="18" start>mdi-clock-outline</v-icon>
                Starts {{ formatDate(election.startTime) }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <v-icon size="96" color="grey-lighten-1" class="mb-4">mdi-vote-outline</v-icon>
        <h3 class="text-2xl font-semibold mb-2">No Elections Available</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          There are no elections at the moment. Check back later!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/utils/api';

const loading = ref(true);
const elections = ref([]);

const fetchElections = async () => {
  try {
    const response = await api.get('/elections');
    elections.value = response.data;
  } catch (error) {
    console.error('Error fetching elections:', error);
  } finally {
    loading.value = false;
  }
};

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'badge badge-active',
    upcoming: 'badge badge-upcoming',
    ended: 'badge badge-ended'
  };
  return classes[status] || 'badge';
};

const getTimeRemaining = (election) => {
  const now = new Date();
  const end = new Date(election.endTime);
  const diff = end - now;

  if (diff < 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `Ends in ${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Ends in ${hours} hour${hours > 1 ? 's' : ''}`;
  return 'Ending soon';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  document.title = 'Elections - University Voting System';
  fetchElections();
});
</script>
