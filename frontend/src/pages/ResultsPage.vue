<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div class="container-custom py-4">
        <router-link to="/elections" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400">
          <v-icon size="20">mdi-arrow-left</v-icon>
          Back to Elections
        </router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container-custom py-8">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64" class="mx-auto mb-4"></v-progress-circular>
        <p class="text-gray-600 dark:text-gray-400">Loading results...</p>
      </div>

      <!-- Content -->
      <template v-else-if="election">
        <!-- Header -->
        <div class="text-center mb-8">
          <v-icon size="96" color="warning" class="mb-4">mdi-trophy</v-icon>
          <h1 class="text-4xl font-bold mb-2">Election Results</h1>
          <h2 class="text-2xl text-gray-600 dark:text-gray-400 mb-4">{{ election.title }}</h2>
          <div class="flex items-center justify-center gap-6 text-sm flex-wrap">
            <span class="badge" :class="isElectionEnded ? 'badge-ended' : 'badge-ongoing'">
              {{ isElectionEnded ? 'Ended' : 'Ongoing' }}
            </span>
            <span>
              <v-icon size="16">mdi-calendar</v-icon>
              {{ formatDate(election.endTime) }}
            </span>
            <span>
              <v-icon size="16">mdi-account-group</v-icon>
              {{ totalVotes }} total votes
            </span>
          </div>
        </div>

        <!-- Results Not Available (Election Not Ended) -->
        <div v-if="!isElectionEnded" class="card max-w-2xl mx-auto">
          <div class="card-body text-center py-12">
            <v-icon size="96" color="grey-lighten-1" class="mb-4">mdi-clock-outline</v-icon>
            <h3 class="text-2xl font-bold mb-2">Results Not Yet Available</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Results will be revealed after the election ends.
            </p>
          </div>
        </div>

        <!-- Results by Position -->
        <div v-else-if="Object.keys(resultsByPosition).length > 0" class="space-y-12">
          <div v-for="(candidates, position) in resultsByPosition" :key="position">
            
            <!-- Position Title -->
            <h2 class="text-3xl font-bold mb-6">{{ position }}</h2>

            <!-- Winner Card -->
            <div v-if="candidates[0]" class="card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-400 mb-6 max-w-3xl mx-auto">
              <div class="card-body text-center py-8">
                <v-icon size="96" color="warning" class="mb-4">mdi-trophy-award</v-icon>
                <div class="flex items-center justify-center gap-4 mb-4">
                  <img 
                    :src="candidates[0].profileImage || '/assets/avatars/default.svg'" 
                    :alt="candidates[0].name"
                    class="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
                  />
                  <div class="text-left">
                    <h3 class="text-3xl font-bold">{{ candidates[0].name }}</h3>
                    <p class="text-xl text-gray-600 dark:text-gray-400">
                      {{ candidates[0].department }}<span v-if="candidates[0].year"> • Year {{ candidates[0].year }}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-center gap-8">
                  <div>
                    <p class="text-4xl font-bold text-yellow-600">{{ candidates[0].voteCount || 0 }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">votes</p>
                  </div>
                  <div>
                    <p class="text-4xl font-bold text-yellow-600">{{ candidates[0].percentage || 0 }}%</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">of total</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- All Candidates -->
            <div class="max-w-4xl mx-auto space-y-4">
              <div v-for="(candidate, index) in candidates" :key="candidate._id" class="card">
                <div class="card-body">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold" :class="getRankColor(index)">
                      {{ index + 1 }}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <img :src="candidate.profileImage || '/assets/avatars/default.svg'" :alt="candidate.name" class="w-12 h-12 rounded-full object-cover"/>
                        <div>
                          <h4 class="text-lg font-bold">{{ candidate.name }}</h4>
                          <p class="text-sm text-gray-600 dark:text-gray-400">
                            <v-icon size="12">mdi-school</v-icon>
                            {{ candidate.department }}<span v-if="candidate.year"> • Year {{ candidate.year }}</span>
                          </p>
                        </div>
                      </div>
                      <div class="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-end pr-4" :style="{ width: `${candidate.percentage || 0}%` }">
                          <span class="text-white text-sm font-bold" v-if="(candidate.percentage || 0) > 10">{{ candidate.percentage || 0 }}%</span>
                        </div>
                      </div>
                      <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span>{{ candidate.voteCount || 0 }} votes</span>
                        <span>{{ candidate.percentage || 0 }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div class="card card-body text-center">
              <p class="text-3xl font-bold text-primary-600">{{ totalVotes }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Votes</p>
            </div>
            <div class="card card-body text-center">
              <p class="text-3xl font-bold text-primary-600">{{ Object.keys(resultsByPosition).length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Positions</p>
            </div>
            <div class="card card-body text-center">
              <p class="text-3xl font-bold text-primary-600">{{ getTotalCandidates() }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Candidates</p>
            </div>
          </div>
        </div>

        <!-- No Votes -->
        <div v-else class="text-center py-16">
          <v-icon size="96" color="grey-lighten-1" class="mb-4">mdi-chart-bar</v-icon>
          <h3 class="text-2xl font-semibold mb-2">No Votes Cast</h3>
          <p class="text-gray-600 dark:text-gray-400">This election received no votes.</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/utils/api';

const route = useRoute();
const loading = ref(true);
const election = ref(null);
const resultsByPosition = ref({});
const totalVotes = ref(0);

const isElectionEnded = computed(() => {
  if (!election.value) return false;
  return new Date() > new Date(election.value.endTime);
});

const fetchResults = async () => {
  try {
    const response = await api.get(`/votes/results/${route.params.id}`);
    console.log('✅ Results Response:', response.data);
    
    election.value = response.data.election;
    resultsByPosition.value = response.data.resultsByPosition || {};
    totalVotes.value = response.data.totalVotes || 0;
    
    console.log('Election:', election.value);
    console.log('Results by Position:', resultsByPosition.value);
    console.log('Is Election Ended:', isElectionEnded.value);
  } catch (error) {
    console.error('❌ Error fetching results:', error);
    alert('Failed to load results');
  } finally {
    loading.value = false;
  }
};

const getTotalCandidates = () => {
  return Object.values(resultsByPosition.value).reduce((sum, candidates) => sum + candidates.length, 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not available';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Date error';
  }
};

const getRankColor = (index) => {
  const colors = ['bg-yellow-400 text-white', 'bg-gray-400 text-white', 'bg-orange-600 text-white', 'bg-gray-200 text-gray-700'];
  return colors[index] || colors[3];
};

onMounted(() => {
  fetchResults();
});
</script>

<style scoped>
.badge-ended {
  background-color: #ef4444;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.badge-ongoing {
  background-color: #10b981;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}
</style>
