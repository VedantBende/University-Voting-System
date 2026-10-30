<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div class="container-custom py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/admin" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              <v-icon size="20" start>mdi-arrow-left</v-icon>
              Admin Dashboard
            </router-link>
            <h1 class="text-xl font-bold">Manage Elections</h1>
          </div>
          <router-link to="/admin/elections/create" class="btn btn-primary">
            <v-icon size="20" start>mdi-plus</v-icon>
            Create Election
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container-custom py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="48" class="mx-auto mb-4"></v-progress-circular>
        <p class="text-gray-600 dark:text-gray-400">Loading elections...</p>
      </div>

      <!-- Elections List -->
      <div v-else class="space-y-6">
        <div v-for="election in elections" :key="election._id" class="card">
          <div class="card-body">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-2xl font-bold">{{ election.title }}</h3>
                  <span :class="getStatusBadgeClass(election.status)">
                    {{ election.status }}
                  </span>
                </div>
                <p class="text-gray-600 dark:text-gray-400 mb-2">{{ election.description }}</p>
                <div class="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    <v-icon size="16">mdi-calendar</v-icon>
                    {{ formatDate(election.startTime) }} - {{ formatDate(election.endTime) }}
                  </span>
                  <span>
                    <v-icon size="16">mdi-folder</v-icon>
                    {{ election.category }}
                  </span>
                  <span>
                    <v-icon size="16">mdi-account-group</v-icon>
                    {{ election.totalVotes || 0 }} votes
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="viewCandidates(election)" class="btn btn-sm btn-primary">
                  <v-icon size="16" start>mdi-account-multiple</v-icon>
                  Manage Candidates
                </button>
                <button @click="deleteElection(election._id)" class="btn btn-sm btn-danger">
                  <v-icon size="16" start>mdi-delete</v-icon>
                  Delete
                </button>
              </div>
            </div>

            <!-- Candidates Section -->
            <div v-if="selectedElection?._id === election._id" class="mt-6 pt-6 border-t">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold">
                  <v-icon size="20" start>mdi-account-group</v-icon>
                  Candidates ({{ candidates.length }})
                </h4>
                <button @click="openAddCandidate()" class="btn btn-sm btn-primary">
                  <v-icon size="16" start>mdi-plus</v-icon>
                  Add Candidate
                </button>
              </div>

              <!-- Add/Edit Candidate Form -->
              <div v-if="showCandidateForm" class="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h5 class="font-semibold mb-3">
                  <v-icon size="18" start>{{ editingCandidate ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
                  {{ editingCandidate ? 'Edit Candidate' : 'Add New Candidate' }}
                </h5>
                <CandidateForm 
                  :electionId="election._id"
                  :availablePositions="election.positions"
                  :candidate="editingCandidate"
                  @success="handleCandidateSaved"
                  @cancel="closeCandidateForm"
                />
              </div>

              <!-- Candidates Grid -->
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="candidate in candidates" :key="candidate._id" 
                     class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <img 
                      :src="candidate.profileImage || '/assets/avatars/default.svg'" 
                      :alt="candidate.name"
                      class="w-16 h-16 rounded-full object-cover"
                    />
                    <div class="flex-1">
                      <h5 class="font-semibold">{{ candidate.name }}</h5>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ candidate.position }}</p>
                      <p class="text-xs text-gray-500 mt-1">
                        <v-icon size="12">mdi-school</v-icon>
                        {{ candidate.department }} - Year {{ candidate.year }}
                      </p>
                      <div class="flex gap-3 mt-2">
                        <button @click="editCandidate(candidate)" class="text-blue-600 hover:underline text-xs font-medium">
                          <v-icon size="12">mdi-pencil</v-icon>
                          Edit
                        </button>
                        <button @click="deleteCandidate(candidate._id)" class="text-red-600 hover:underline text-xs font-medium">
                          <v-icon size="12">mdi-delete</v-icon>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="candidates.length === 0" class="col-span-full text-center py-8 text-gray-500">
                  <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-account-off</v-icon>
                  <p>No candidates added yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="elections.length === 0" class="card card-body text-center py-12">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-vote</v-icon>
          <h3 class="text-xl font-semibold mb-2">No Elections Yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Create your first election to get started</p>
          <router-link to="/admin/elections/create" class="btn btn-primary inline-block">
            <v-icon size="16" start>mdi-plus</v-icon>
            Create First Election
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/api';
import CandidateForm from '@/components/admin/CandidateForm.vue';

const router = useRouter();
const loading = ref(true);
const elections = ref([]);
const selectedElection = ref(null);
const candidates = ref([]);
const showCandidateForm = ref(false);
const editingCandidate = ref(null);

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

const viewCandidates = async (election) => {
  if (selectedElection.value?._id === election._id) {
    selectedElection.value = null;
    candidates.value = [];
    showCandidateForm.value = false;
    editingCandidate.value = null;
    return;
  }

  selectedElection.value = election;
  showCandidateForm.value = false;
  editingCandidate.value = null;
  
  try {
    const response = await api.get(`/candidates/election/${election._id}`);
    candidates.value = response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
  }
};

const openAddCandidate = () => {
  editingCandidate.value = null;
  showCandidateForm.value = true;
};

const editCandidate = (candidate) => {
  editingCandidate.value = candidate;
  showCandidateForm.value = true;
};

const closeCandidateForm = () => {
  showCandidateForm.value = false;
  editingCandidate.value = null;
};

const handleCandidateSaved = (data) => {
  showCandidateForm.value = false;
  editingCandidate.value = null;
  
  if (data.candidate) {
    alert(`✅ Candidate "${data.candidate.name}" ${data.isEdit ? 'updated' : 'added'} successfully!`);
  }
  
  viewCandidates(selectedElection.value);
};

const deleteElection = async (id) => {
  if (!confirm('Are you sure you want to delete this election? This cannot be undone.')) {
    return;
  }

  try {
    await api.delete(`/elections/${id}`);
    alert('✅ Election deleted successfully');
    fetchElections();
  } catch (error) {
    console.error('Error deleting election:', error);
    alert('❌ ' + (error.response?.data?.error || 'Failed to delete election'));
  }
};

const deleteCandidate = async (id) => {
  if (!confirm('Are you sure you want to delete this candidate?')) {
    return;
  }

  try {
    await api.delete(`/candidates/${id}`);
    alert('✅ Candidate deleted successfully');
    viewCandidates(selectedElection.value);
  } catch (error) {
    console.error('Error deleting candidate:', error);
    alert('❌ ' + (error.response?.data?.error || 'Failed to delete candidate'));
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid date';
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

onMounted(() => {
  document.title = 'Manage Elections - Admin';
  fetchElections();
});
</script>
