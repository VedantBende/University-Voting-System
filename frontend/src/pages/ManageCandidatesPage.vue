<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div class="container-custom py-4">
        <div class="flex items-center justify-between">
          <router-link to="/admin/elections" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400">
            <v-icon size="20">mdi-arrow-left</v-icon>
            Back to Elections
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container-custom py-8">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="48" class="mx-auto mb-4"></v-progress-circular>
        <p class="text-gray-600 dark:text-gray-400">Loading candidates...</p>
      </div>

      <!-- Content -->
      <template v-else-if="election">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">Manage Candidates</h1>
          <p class="text-gray-600 dark:text-gray-400">{{ election.title }}</p>
        </div>

        <!-- Add Candidate Button -->
        <div class="mb-6">
          <button @click="showAddModal = true" class="btn btn-primary">
            <v-icon size="18" start>mdi-plus</v-icon>
            Add Candidate
          </button>
        </div>

        <!-- Candidates List -->
        <div v-if="candidates.length > 0">
          <h2 class="text-xl font-bold mb-4">
            <v-icon size="24" start>mdi-account-group</v-icon>
            Candidates ({{ candidates.length }})
          </h2>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="candidate in candidates" :key="candidate._id" class="card">
              <div class="card-body">
                <div class="flex items-start gap-4 mb-4">
                  <img 
                    :src="candidate.profileImage || '/assets/avatars/default.svg'" 
                    :alt="candidate.name"
                    class="w-16 h-16 rounded-full object-cover"
                  />
                  <div class="flex-1">
                    <h3 class="text-lg font-bold">{{ candidate.name }}</h3>
                    <p class="text-primary-600 dark:text-primary-400 text-sm font-medium">{{ candidate.position }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      <v-icon size="12">mdi-school</v-icon>
                      {{ candidate.department }} - Year {{ candidate.year }}
                    </p>
                  </div>
                </div>

                <div v-if="candidate.manifesto" class="mb-4">
                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {{ candidate.manifesto }}
                  </p>
                </div>

                <div class="flex gap-2">
                  <button @click="editCandidate(candidate)" class="btn btn-secondary flex-1">
                    <v-icon size="16" start>mdi-pencil</v-icon>
                    Edit
                  </button>
                  <button @click="confirmDelete(candidate)" class="btn btn-danger flex-1">
                    <v-icon size="16" start>mdi-delete</v-icon>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Candidates -->
        <div v-else class="text-center py-16">
          <v-icon size="96" color="grey-lighten-1" class="mb-4">mdi-account-group-outline</v-icon>
          <h3 class="text-2xl font-semibold mb-2">No Candidates Yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Add candidates for this election to begin.
          </p>
          <button @click="showAddModal = true" class="btn btn-primary">
            <v-icon size="18" start>mdi-plus</v-icon>
            Add First Candidate
          </button>
        </div>
      </template>
    </div>

    <!-- Add/Edit Candidate Modal -->
    <div v-if="showAddModal || editingCandidate" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-8 my-8">
        <h2 class="text-2xl font-bold mb-6">
          <v-icon size="24" start>{{ editingCandidate ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          {{ editingCandidate ? 'Edit Candidate' : 'Add New Candidate' }}
        </h2>
        
        <form @submit.prevent="saveCandidate" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="label">Full Name *</label>
            <input v-model="candidateForm.name" type="text" class="input" required placeholder="e.g., John Doe" />
          </div>

          <!-- Position -->
          <div>
            <label class="label">Position *</label>
            <select v-model="candidateForm.position" class="input" required>
              <option value="">Select Position</option>
              <option v-for="pos in election?.positions" :key="pos.name" :value="pos.name">
                {{ pos.name }}
              </option>
            </select>
          </div>

          <!-- Department -->
          <div>
            <label class="label">Department *</label>
            <input v-model="candidateForm.department" type="text" class="input" required placeholder="e.g., Computer Science" />
          </div>

          <!-- Year -->
          <div>
            <label class="label">Year *</label>
            <select v-model="candidateForm.year" class="input" required>
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
            </select>
          </div>

          <!-- Manifesto -->
          <div>
            <label class="label">Manifesto</label>
            <textarea v-model="candidateForm.manifesto" class="input min-h-[120px]" placeholder="Candidate's manifesto and vision..."></textarea>
          </div>

          <!-- Profile Image URL -->
          <div>
            <label class="label">Profile Image URL</label>
            <input v-model="candidateForm.profileImage" type="url" class="input" placeholder="https://..." />
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeModal" class="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" :disabled="submitting" class="btn btn-primary flex-1">
              <v-progress-circular v-if="submitting" indeterminate size="16" width="2" class="mr-2"></v-progress-circular>
              {{ submitting ? 'Saving...' : editingCandidate ? 'Update' : 'Add Candidate' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deletingCandidate" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8">
        <h2 class="text-2xl font-bold mb-4">
          <v-icon size="24" color="error" start>mdi-alert-circle</v-icon>
          Delete Candidate?
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete <strong>{{ deletingCandidate.name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <button @click="deletingCandidate = null" class="btn btn-secondary flex-1">
            Cancel
          </button>
          <button @click="deleteCandidate" :disabled="submitting" class="btn btn-danger flex-1">
            <v-progress-circular v-if="submitting" indeterminate size="16" width="2" class="mr-2"></v-progress-circular>
            {{ submitting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/utils/api';

const route = useRoute();

const loading = ref(true);
const submitting = ref(false);
const election = ref(null);
const candidates = ref([]);
const showAddModal = ref(false);
const editingCandidate = ref(null);
const deletingCandidate = ref(null);

const candidateForm = ref({
  name: '',
  position: '',
  department: '',
  year: '',
  manifesto: '',
  profileImage: ''
});

const fetchData = async () => {
  try {
    const electionId = route.params.id;

    const electionRes = await api.get(`/elections/${electionId}`);
    election.value = electionRes.data;

    const candidatesRes = await api.get(`/candidates/election/${electionId}`);
    candidates.value = candidatesRes.data;

  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to load data');
  } finally {
    loading.value = false;
  }
};

const editCandidate = (candidate) => {
  editingCandidate.value = candidate;
  candidateForm.value = {
    name: candidate.name,
    position: candidate.position,
    department: candidate.department,
    year: candidate.year?.toString() || '',
    manifesto: candidate.manifesto || '',
    profileImage: candidate.profileImage || ''
  };
};

const closeModal = () => {
  showAddModal.value = false;
  editingCandidate.value = null;
  candidateForm.value = {
    name: '',
    position: '',
    department: '',
    year: '',
    manifesto: '',
    profileImage: ''
  };
};

const saveCandidate = async () => {
  submitting.value = true;
  try {
    const payload = {
      electionId: route.params.id,
      name: candidateForm.value.name.trim(),
      position: candidateForm.value.position,
      department: candidateForm.value.department.trim(),
      year: parseInt(candidateForm.value.year),
      manifesto: candidateForm.value.manifesto?.trim() || '',
      profileImage: candidateForm.value.profileImage?.trim() || ''
    };

    if (editingCandidate.value) {
      await api.put(`/candidates/${editingCandidate.value._id}`, payload);
      alert('✅ Candidate updated successfully!');
    } else {
      await api.post('/candidates', payload);
      alert('✅ Candidate added successfully!');
    }

    closeModal();
    await fetchData();
  } catch (error) {
    console.error('Error saving candidate:', error);
    alert('❌ Error: ' + (error.response?.data?.error || error.message));
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = (candidate) => {
  deletingCandidate.value = candidate;
};

const deleteCandidate = async () => {
  submitting.value = true;
  try {
    await api.delete(`/candidates/${deletingCandidate.value._id}`);
    alert('✅ Candidate deleted successfully!');
    deletingCandidate.value = null;
    await fetchData();
  } catch (error) {
    console.error('Error deleting candidate:', error);
    alert('❌ Error: ' + (error.response?.data?.error || error.message));
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
