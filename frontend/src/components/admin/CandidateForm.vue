<template>
  <div class="card">
    <div class="card-header">
      <h3 class="text-xl font-bold">{{ isEdit ? 'Edit Candidate' : 'Add Candidate' }}</h3>
    </div>
    
    <form @submit.prevent="handleSubmit" class="card-body space-y-4">
      <!-- Candidate Name -->
      <div>
        <label class="label">Candidate Name *</label>
        <input 
          v-model="form.name" 
          type="text" 
          class="input" 
          placeholder="Full name of the candidate"
          required
        />
      </div>

      <!-- Position -->
      <div>
        <label class="label">Position *</label>
        <select v-model="form.position" class="input" required>
          <option value="">Select Position</option>
          <option v-for="pos in availablePositions" :key="pos.name" :value="pos.name">
            {{ pos.name }}
          </option>
        </select>
      </div>

      <!-- Department & Year -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="label">Department</label>
          <input 
            v-model="form.department" 
            type="text" 
            class="input" 
            placeholder="e.g., Computer Science"
          />
        </div>
        <div>
          <label class="label">Year</label>
          <select v-model="form.year" class="input">
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
            <option value="5">5th Year</option>
          </select>
        </div>
      </div>

      <!-- Manifesto -->
      <div>
        <label class="label">Manifesto / Campaign Statement</label>
        <textarea 
          v-model="form.manifesto" 
          class="input min-h-[120px]" 
          placeholder="What are your goals and promises if elected?"
        ></textarea>
      </div>

      <!-- Profile Image URL -->
      <div>
        <label class="label">Profile Image URL (Optional)</label>
        <input 
          v-model="form.profileImage" 
          type="url" 
          class="input" 
          placeholder="https://example.com/image.jpg"
        />
        <p class="text-xs text-gray-500 mt-1">Leave blank to use default avatar</p>
      </div>

      <!-- Social Links -->
      <div>
        <label class="label">Social Media Links (Optional)</label>
        <div class="space-y-2">
          <input 
            v-model="form.socialLinks.linkedin" 
            type="url" 
            class="input" 
            placeholder="LinkedIn URL"
          />
          <input 
            v-model="form.socialLinks.instagram" 
            type="url" 
            class="input" 
            placeholder="Instagram URL"
          />
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex gap-3 pt-4">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner mr-2"></span>
          {{ isEdit ? 'Update Candidate' : 'Add Candidate' }}
        </button>
        <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '@/utils/api';

const props = defineProps({
  electionId: {
    type: String,
    required: true
  },
  availablePositions: {
    type: Array,
    default: () => []
  },
  candidate: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['success', 'cancel']);

const loading = ref(false);
const form = ref({
  name: '',
  position: '',
  department: '',
  year: '',
  manifesto: '',
  profileImage: '',
  socialLinks: {
    linkedin: '',
    instagram: ''
  }
});

watch(() => props.candidate, (newVal) => {
  if (newVal) {
    form.value = {
      name: newVal.name || '',
      position: newVal.position || '',
      department: newVal.department || '',
      year: newVal.year?.toString() || '',
      manifesto: newVal.manifesto || '',
      profileImage: newVal.profileImage || '',
      socialLinks: {
        linkedin: newVal.socialLinks?.linkedin || '',
        instagram: newVal.socialLinks?.instagram || ''
      }
    };
  }
}, { immediate: true });

const handleSubmit = async () => {
  loading.value = true;
  
  try {
    const payload = {
      electionId: props.electionId,
      name: form.value.name,
      position: form.value.position,
      department: form.value.department,
      year: form.value.year ? parseInt(form.value.year) : null,
      manifesto: form.value.manifesto,
      profileImage: form.value.profileImage || '/assets/avatars/default.svg',
      socialLinks: form.value.socialLinks
    };

    let response;
    if (props.isEdit && props.candidate) {
      response = await api.put(`/candidates/${props.candidate._id}`, payload);
    } else {
      response = await api.post('/candidates', payload);
    }

    emit('success', response.data);
  } catch (error) {
    console.error('Error saving candidate:', error);
    alert(error.response?.data?.error || 'Failed to save candidate');
  } finally {
    loading.value = false;
  }
};
</script>
