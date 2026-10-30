<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div class="container-custom py-4">
        <router-link to="/elections" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition">
          <v-icon size="20">mdi-arrow-left</v-icon>
          Back to Elections
        </router-link>
      </div>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="container-custom py-12 text-center">
      <v-progress-circular indeterminate color="primary" size="48" class="mx-auto mb-4"></v-progress-circular>
      <p class="text-gray-600 dark:text-gray-400">Loading ballot...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container-custom py-12">
      <div class="card card-body text-center max-w-2xl mx-auto">
        <v-icon size="96" color="warning" class="mb-4">mdi-alert</v-icon>
        <p class="text-red-600 dark:text-red-400 text-lg mb-4">{{ error }}</p>
        <button @click="router.push('/elections')" class="btn btn-primary">
          Back to Elections
        </button>
      </div>
    </div>

    <!-- Voting Content -->
    <div v-else-if="election" class="container-custom py-8">
      <!-- Election Header -->
      <div class="card card-body mb-8">
        <h1 class="text-3xl font-bold mb-2">{{ election.title }}</h1>
        <p v-if="election.description" class="text-gray-600 dark:text-gray-400">
          {{ election.description }}
        </p>
      </div>

      <!-- Progress Indicator -->
      <div class="card card-body mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">Voting Progress</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ votedPositions.size }} / {{ election.positions?.length || 0 }} positions
          </span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: election.positions?.length ? `${(votedPositions.size / election.positions.length) * 100}%` : '0%' }"
          ></div>
        </div>
      </div>

      <!-- No Positions Message -->
      <div v-if="!election.positions || election.positions.length === 0" class="card card-body text-center py-12">
        <v-icon size="96" color="grey-lighten-1" class="mb-4">mdi-clipboard-list</v-icon>
        <p class="text-gray-500 dark:text-gray-400 text-lg">No positions available for this election yet.</p>
      </div>

      <!-- Positions -->
      <div v-else class="space-y-8">
        <div v-for="position in election.positions" :key="position._id || position.name" class="card">
          <!-- Position Header -->
          <div class="card-header flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold">{{ position.name || position }}</h2>
              <p v-if="position.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ position.description }}
              </p>
            </div>
            <span 
              v-if="hasVoted(position.name || position)"
              class="badge badge-success"
            >
              <v-icon size="16" start>mdi-check</v-icon>
              Already Voted
            </span>
          </div>

          <!-- Candidates Grid -->
          <div class="card-body">
            <div 
              v-if="getCandidatesForPosition(position.name || position).length > 0"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div 
                v-for="candidate in getCandidatesForPosition(position.name || position)" 
                :key="candidate._id"
                class="candidate-card"
              >
                <!-- Candidate Info -->
                <div class="text-center mb-4">
                  <img 
                    :src="candidate.profileImage || '/assets/avatars/default.svg'" 
                    :alt="candidate.name"
                    class="w-24 h-24 rounded-full mx-auto object-cover border-2 border-gray-200 dark:border-gray-700"
                  >
                  <h3 class="mt-4 text-lg font-bold">{{ candidate.name }}</h3>
                  <p v-if="candidate.department || candidate.year" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <v-icon size="12">mdi-school</v-icon>
                    <span v-if="candidate.department">{{ candidate.department }}</span>
                    <span v-if="candidate.department && candidate.year"> • </span>
                    <span v-if="candidate.year">Year {{ candidate.year }}</span>
                  </p>
                </div>

                <!-- Manifesto -->
                <p v-if="candidate.manifesto" class="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                  {{ candidate.manifesto }}
                </p>

                <!-- Vote Button -->
                <button 
                  @click="vote(candidate._id, position.name || position)"
                  :disabled="hasVoted(position.name || position)"
                  class="btn w-full"
                  :class="hasVoted(position.name || position) ? 'btn-disabled' : 'btn-primary'"
                >
                  <v-icon v-if="hasVoted(position.name || position)" size="18" start>mdi-check-circle</v-icon>
                  <v-icon v-else size="18" start>mdi-vote</v-icon>
                  {{ hasVoted(position.name || position) ? 'Already Voted' : 'Cast Vote' }}
                </button>
              </div>
            </div>

            <!-- No Candidates -->
            <div v-else class="text-center py-12">
              <v-icon size="96" color="grey-lighten-1" class="mb-4">mdi-account-group-outline</v-icon>
              <p class="text-gray-500 dark:text-gray-400">No candidates registered for this position yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth, useSession } from '@clerk/vue';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const { isLoaded, isSignedIn } = useAuth();
const { session } = useSession();

const electionId = route.params.id;
const election = ref(null);
const candidates = ref([]);
const loading = ref(true);
const error = ref(null);
const votedPositions = ref(new Set());

const getCandidatesForPosition = (positionName) => {
  return candidates.value.filter(c => c.position === positionName);
};

const hasVoted = (positionName) => {
  return votedPositions.value.has(positionName);
};

const getAuthToken = async () => {
  let attempts = 0;
  while (!session.value && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  
  if (!session.value) {
    throw new Error('No session available');
  }
  
  return await session.value.getToken();
};

const vote = async (candidateId, position) => {
  if (hasVoted(position)) {
    return;
  }

  try {
    if (!isSignedIn.value) {
      error.value = 'You must be signed in to vote';
      return;
    }

    const token = await getAuthToken();
    
    await axios.post(
      'http://localhost:5000/api/votes',
      {
        electionId: electionId,
        candidateId: candidateId,
        position: position
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    votedPositions.value.add(position);
    
  } catch (err) {
    console.error('Error casting vote:', err);
    error.value = err.response?.data?.message || 'Failed to cast vote.';
    setTimeout(() => error.value = null, 5000);
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    
    console.log('Loading election:', electionId);

    let attempts = 0;
    while (!isLoaded.value && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!isSignedIn.value) {
      error.value = 'You must be signed in to view this page';
      router.push('/sign-in');
      return;
    }

    const token = await getAuthToken();

    const [electionResponse, candidatesResponse, votingStatusResponse] = await Promise.all([
      axios.get(`http://localhost:5000/api/elections/${electionId}`).catch(err => {
        console.error('Election fetch error:', err.response?.data || err.message);
        throw new Error('Failed to load election details');
      }),
      axios.get(`http://localhost:5000/api/candidates/election/${electionId}`).catch(err => {
        console.error('Candidates fetch error:', err.response?.data || err.message);
        return { data: [] };
      }),
      axios.get(`http://localhost:5000/api/votes/check/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => {
        console.error('Voting status error:', err.response?.data || err.message);
        return { data: { votedPositions: [] } };
      })
    ]);

    election.value = electionResponse.data;
    candidates.value = candidatesResponse.data || [];

    if (votingStatusResponse.data?.votedPositions) {
      votedPositions.value = new Set(votingStatusResponse.data.votedPositions);
    }

    console.log('✅ Election loaded:', election.value);
    console.log('✅ Candidates:', candidates.value.length);
    console.log('✅ Voted positions:', Array.from(votedPositions.value));

    loading.value = false;
  } catch (err) {
    console.error('❌ Error loading election:', err);
    error.value = err.message || 'Failed to load election. Please try again.';
    loading.value = false;
  }
});
</script>

<style scoped>
.candidate-card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-all duration-200;
}
</style>
