<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-2xl font-bold">{{ isEdit ? 'Edit Election' : 'Create New Election' }}</h2>
    </div>
    
    <form @submit.prevent="handleSubmit" class="card-body space-y-6">
      <!-- Election Title -->
      <div>
        <label class="label">Election Title *</label>
        <input 
          v-model="form.title" 
          type="text" 
          class="input" 
          placeholder="e.g., Student Council Elections 2025"
          required
          :disabled="loading"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="label">Description</label>
        <textarea 
          v-model="form.description" 
          class="input min-h-[100px]" 
          placeholder="Brief description of the election..."
          :disabled="loading"
        ></textarea>
      </div>

      <!-- Category -->
      <div>
        <label class="label">Category *</label>
        <select v-model="form.category" class="input" required :disabled="loading">
          <option value="">Select Category</option>
          <option value="student_council">Student Council</option>
          <option value="class_representative">Class Representative</option>
          <option value="club">Club Elections</option>
          <option value="other">Other</option>
        </select>
      </div>

      <!-- Date Range -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="label">Start Date & Time *</label>
          <input 
            v-model="form.startTime" 
            type="datetime-local" 
            class="input" 
            required
            :disabled="loading"
          />
        </div>
        <div>
          <label class="label">End Date & Time *</label>
          <input 
            v-model="form.endTime" 
            type="datetime-local" 
            class="input" 
            required
            :disabled="loading"
          />
        </div>
      </div>

      <!-- Positions -->
      <div>
        <label class="label">Positions Available</label>
        <div class="space-y-3">
          <div v-for="(position, index) in form.positions" :key="index" class="flex gap-2">
            <input 
              v-model="position.name" 
              type="text" 
              class="input flex-1" 
              placeholder="Position name (e.g., President)"
              :disabled="loading"
            />
            <button 
              type="button" 
              @click="removePosition(index)" 
              class="btn btn-danger"
              :disabled="form.positions.length === 1 || loading"
            >
              Remove
            </button>
          </div>
        </div>
        <button 
          type="button" 
          @click="addPosition" 
          class="btn btn-secondary mt-2"
          :disabled="loading"
        >
          + Add Position
        </button>
      </div>

      <!-- Eligibility -->
      <div>
        <label class="label">Eligible Voters</label>
        <div class="space-y-2">
          <label class="flex items-center gap-2">
            <input 
              type="checkbox" 
              v-model="form.allStudents" 
              class="w-4 h-4"
              :disabled="loading"
            />
            <span class="text-sm">All students can vote</span>
          </label>
          
          <div v-if="!form.allStudents" class="grid md:grid-cols-2 gap-4 mt-3">
            <div>
              <label class="label text-sm">Department</label>
              <input 
                v-model="form.eligibility.department" 
                type="text" 
                class="input" 
                placeholder="e.g., Computer Science"
                :disabled="loading"
              />
            </div>
            <div>
              <label class="label text-sm">Year</label>
              <select v-model="form.eligibility.year" class="input" :disabled="loading">
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-start gap-2">
          <span class="text-red-600 dark:text-red-400 text-xl">⚠️</span>
          <div>
            <p class="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
              Error Creating Election
            </p>
            <p class="text-sm text-red-700 dark:text-red-300">
              {{ error }}
            </p>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div class="flex items-start gap-2">
          <span class="text-green-600 dark:text-green-400 text-xl">✅</span>
          <div>
            <p class="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
              Success!
            </p>
            <p class="text-sm text-green-700 dark:text-green-300">
              {{ success }}
            </p>
          </div>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex gap-3 pt-4">
        <button 
          type="submit" 
          class="btn btn-primary" 
          :disabled="loading"
        >
          <span v-if="loading" class="spinner mr-2"></span>
          {{ loading ? 'Saving...' : (isEdit ? 'Update Election' : 'Create Election') }}
        </button>
        <button 
          type="button" 
          @click="handleCancel" 
          class="btn btn-secondary"
          :disabled="loading"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAuth } from '@clerk/vue';
import api from '@/utils/api';

const props = defineProps({
  election: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['success', 'cancel']);

const { isSignedIn } = useAuth();
const loading = ref(false);
const error = ref('');
const success = ref('');

const form = ref({
  title: '',
  description: '',
  category: '',
  startTime: '',
  endTime: '',
  positions: [{ name: '', description: '' }],
  allStudents: true,
  eligibility: {
    department: '',
    year: ''
  }
});

// Initialize form with existing data if editing
watch(() => props.election, (newVal) => {
  if (newVal) {
    form.value = {
      title: newVal.title || '',
      description: newVal.description || '',
      category: newVal.category || '',
      startTime: newVal.startTime ? new Date(newVal.startTime).toISOString().slice(0, 16) : '',
      endTime: newVal.endTime ? new Date(newVal.endTime).toISOString().slice(0, 16) : '',
      positions: newVal.positions && newVal.positions.length > 0 
        ? newVal.positions 
        : [{ name: '', description: '' }],
      allStudents: !newVal.eligibleVoters || newVal.eligibleVoters.length === 0,
      eligibility: {
        department: newVal.eligibleVoters?.[0]?.department || '',
        year: newVal.eligibleVoters?.[0]?.year?.toString() || ''
      }
    };
  }
}, { immediate: true });

const addPosition = () => {
  form.value.positions.push({ name: '', description: '' });
};

const removePosition = (index) => {
  if (form.value.positions.length > 1) {
    form.value.positions.splice(index, 1);
  }
};

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
    emit('cancel');
  }
};

const validateForm = () => {
  // Reset messages
  error.value = '';
  success.value = '';

  // Check authentication
  if (!isSignedIn.value) {
    throw new Error('You must be signed in to create an election');
  }

  // Validate title
  if (!form.value.title.trim()) {
    throw new Error('Election title is required');
  }

  // Validate category
  if (!form.value.category) {
    throw new Error('Please select a category');
  }

  // Validate dates
  if (!form.value.startTime || !form.value.endTime) {
    throw new Error('Start and end dates are required');
  }

  const startDate = new Date(form.value.startTime);
  const endDate = new Date(form.value.endTime);
  const now = new Date();

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date format');
  }

  if (endDate <= startDate) {
    throw new Error('End time must be after start time');
  }

  if (!props.isEdit && startDate < now) {
    throw new Error('Start time cannot be in the past');
  }

  // Validate positions
  const validPositions = form.value.positions.filter(p => p.name.trim());
  if (validPositions.length === 0) {
    throw new Error('At least one position is required');
  }

  return true;
};

const preparePayload = () => {
  const startDate = new Date(form.value.startTime);
  const endDate = new Date(form.value.endTime);

  return {
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    category: form.value.category,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    positions: form.value.positions
      .filter(p => p.name.trim())
      .map(p => ({
        name: p.name.trim(),
        description: p.description?.trim() || ''
      })),
    eligibleVoters: form.value.allStudents ? [] : [{
      department: form.value.eligibility.department?.trim() || '',
      year: form.value.eligibility.year ? parseInt(form.value.eligibility.year) : null,
      all: false
    }]
  };
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';
  
  try {
    // Validate form
    validateForm();

    // Prepare payload
    const payload = preparePayload();

    console.log('📤 Submitting election:', payload);

    // Make API call
    let response;
    if (props.isEdit && props.election?._id) {
      response = await api.put(`/elections/${props.election._id}`, payload);
      success.value = `Election "${payload.title}" updated successfully!`;
    } else {
      response = await api.post('/elections', payload);
      success.value = `Election "${payload.title}" created successfully!`;
    }

    console.log('✅ Election saved:', response.data);

    // Show success message briefly
    setTimeout(() => {
      emit('success', response.data);
    }, 1000);

  } catch (err) {
    console.error('❌ Error saving election:', err);
    
    // Handle different error types
    if (err.message && !err.response) {
      // Validation error or custom error
      error.value = err.message;
    } else if (err.response?.data?.message) {
      // API error with message
      error.value = err.response.data.message;
    } else if (err.response?.data?.error) {
      // API error with error field
      error.value = err.response.data.error;
    } else if (err.response?.status === 401) {
      // Authentication error
      error.value = 'Authentication failed. Please sign in again.';
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else if (err.response?.status === 403) {
      // Permission error
      error.value = 'You do not have permission to create elections. Contact an administrator.';
    } else if (err.response?.status === 500) {
      // Server error
      error.value = 'Server error. Please try again later or contact support.';
    } else {
      // Generic error
      error.value = 'An unexpected error occurred. Please try again.';
    }

    // Scroll to error message
    setTimeout(() => {
      document.querySelector('.bg-red-50')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // Check if user is signed in
  if (!isSignedIn.value) {
    error.value = 'Please sign in to create elections';
  }
});
</script>

<style scoped>
.spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
