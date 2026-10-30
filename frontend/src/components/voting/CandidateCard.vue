<template>
  <v-card :elevation="elevation" :hover="hover">
    <v-img
      v-if="candidate.photo"
      :src="candidate.photo"
      height="200"
      cover
      class="align-end"
    >
      <v-chip
        v-if="showVoteCount"
        color="primary"
        class="ma-2"
      >
        {{ candidate.votes || 0 }} votes
      </v-chip>
    </v-img>

    <v-card-title class="d-flex align-center justify-space-between">
      <span>{{ candidate.name }}</span>
      <v-chip
        v-if="isWinner"
        color="success"
        size="small"
        prepend-icon="mdi-trophy"
      >
        Winner
      </v-chip>
    </v-card-title>

    <v-card-subtitle v-if="candidate.position">
      {{ candidate.position }}
    </v-card-subtitle>

    <v-card-text>
      <p v-if="candidate.description" class="text-body-2 mb-3">
        {{ candidate.description }}
      </p>

      <!-- Candidate Details -->
      <v-list density="compact" class="bg-transparent">
        <v-list-item v-if="candidate.department" density="compact">
          <template v-slot:prepend>
            <v-icon size="small">mdi-school</v-icon>
          </template>
          <v-list-item-title class="text-body-2">{{ candidate.department }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="candidate.year" density="compact">
          <template v-slot:prepend>
            <v-icon size="small">mdi-calendar</v-icon>
          </template>
          <v-list-item-title class="text-body-2">Year {{ candidate.year }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="candidate.email" density="compact">
          <template v-slot:prepend>
            <v-icon size="small">mdi-email</v-icon>
          </template>
          <v-list-item-title class="text-body-2">{{ candidate.email }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Vote Percentage (Results Page) -->
      <div v-if="showVoteCount && totalVotes > 0" class="mt-4">
        <div class="d-flex justify-space-between mb-1">
          <span class="text-caption">Vote Share</span>
          <span class="text-caption font-weight-bold">{{ votePercentage }}%</span>
        </div>
        <v-progress-linear
          :model-value="votePercentage"
          color="primary"
          height="8"
          rounded
        ></v-progress-linear>
      </div>
    </v-card-text>

    <v-card-actions v-if="showActions">
      <slot name="actions">
        <v-btn
          v-if="!hasVoted && canVote"
          color="primary"
          variant="flat"
          block
          prepend-icon="mdi-vote"
          @click="$emit('vote', candidate)"
        >
          Vote
        </v-btn>
        <v-chip v-else-if="hasVoted" color="success" variant="flat" block>
          <v-icon start>mdi-check-circle</v-icon>
          Voted
        </v-chip>
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  candidate: {
    type: Object,
    required: true
  },
  elevation: {
    type: [String, Number],
    default: 2
  },
  hover: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showVoteCount: {
    type: Boolean,
    default: false
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  canVote: {
    type: Boolean,
    default: true
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  isWinner: {
    type: Boolean,
    default: false
  }
});

defineEmits(['vote']);

const votePercentage = computed(() => {
  if (props.totalVotes === 0) return 0;
  return ((props.candidate.votes || 0) / props.totalVotes * 100).toFixed(1);
});
</script>
