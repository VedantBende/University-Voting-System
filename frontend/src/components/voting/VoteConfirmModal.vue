<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center bg-primary text-white">
        <v-icon start>mdi-vote</v-icon>
        Confirm Your Vote
      </v-card-title>

      <v-card-text class="py-6">
        <v-alert
          type="info"
          variant="tonal"
          class="mb-4"
        >
          <template v-slot:prepend>
            <v-icon>mdi-information</v-icon>
          </template>
          This action cannot be undone. Please review your selection carefully.
        </v-alert>

        <div class="mb-4">
          <h3 class="text-h6 mb-2">You are voting for:</h3>
          
          <!-- Candidate Info -->
          <v-card variant="outlined" class="pa-3">
            <div class="d-flex align-center ga-3">
              <v-avatar
                v-if="candidate.photo"
                :image="candidate.photo"
                size="64"
              ></v-avatar>
              <v-avatar
                v-else
                color="primary"
                size="64"
              >
                <v-icon size="32">mdi-account</v-icon>
              </v-avatar>
              
              <div>
                <div class="text-h6">{{ candidate.name }}</div>
                <div class="text-body-2 text-medium-emphasis">{{ candidate.position }}</div>
                <div v-if="candidate.department" class="text-caption text-medium-emphasis">
                  {{ candidate.department }}
                </div>
              </div>
            </div>
          </v-card>
        </div>

        <!-- Election Info -->
        <div class="mb-4">
          <h3 class="text-subtitle-1 mb-2">Election:</h3>
          <v-chip color="primary" variant="outlined">
            {{ electionTitle }}
          </v-chip>
        </div>

        <!-- Confirmation Checkbox -->
        <v-checkbox
          v-model="confirmed"
          color="primary"
          hide-details
        >
          <template v-slot:label>
            <span class="text-body-2">
              I confirm that this is my final choice
            </span>
          </template>
        </v-checkbox>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-btn
          variant="text"
          @click="handleCancel"
          :disabled="loading"
        >
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          :disabled="!confirmed"
          prepend-icon="mdi-check"
          @click="handleConfirm"
        >
          Confirm Vote
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  candidate: {
    type: Object,
    required: true
  },
  electionTitle: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const confirmed = ref(false);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  confirmed.value = false;
  emit('cancel');
  emit('update:modelValue', false);
};
</script>
