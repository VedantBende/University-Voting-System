<template>
  <v-card :elevation="elevation" :hover="hover">
    <!-- Status Badge -->
    <v-chip
      :color="statusColor"
      class="ma-3 position-absolute"
      style="top: 0; right: 0; z-index: 1;"
    >
      {{ election.status }}
    </v-chip>

    <v-card-title class="text-h5">
      {{ election.title }}
    </v-card-title>

    <v-card-subtitle v-if="election.category">
      {{ election.category }}
    </v-card-subtitle>

    <v-card-text>
      <p v-if="election.description" class="text-body-2 mb-4">
        {{ election.description }}
      </p>

      <!-- Election Details -->
      <v-list density="compact" class="bg-transparent">
        <v-list-item density="compact">
          <template v-slot:prepend>
            <v-icon size="small">mdi-calendar-start</v-icon>
          </template>
          <v-list-item-title class="text-body-2">
            Starts: {{ formatDate(election.startTime) }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item density="compact">
          <template v-slot:prepend>
            <v-icon size="small">mdi-calendar-end</v-icon>
          </template>
          <v-list-item-title class="text-body-2">
            Ends: {{ formatDate(election.endTime) }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item density="compact">
          <template v-slot:prepend>
            <v-icon size="small">mdi-vote</v-icon>
          </template>
          <v-list-item-title class="text-body-2">
            Total Votes: {{ election.totalVotes || 0 }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item v-if="election.positions && election.positions.length" density="compact">
          <template v-slot:prepend>
            <v-icon size="small">mdi-account-group</v-icon>
          </template>
          <v-list-item-title class="text-body-2">
            {{ election.positions.length }} Position(s)
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Countdown Timer -->
      <TimerCountdown
        v-if="showTimer && election.status === 'active'"
        :end-time="election.endTime"
        class="mt-4"
      />
    </v-card-text>

    <v-card-actions>
      <slot name="actions">
        <v-btn
          v-if="election.status === 'active' && !hasVoted"
          color="primary"
          variant="flat"
          block
          prepend-icon="mdi-vote"
          @click="$emit('vote', election)"
        >
          Vote Now
        </v-btn>
        <v-btn
          v-else-if="election.status === 'ended' || hasVoted"
          color="secondary"
          variant="outlined"
          block
          prepend-icon="mdi-chart-bar"
          @click="$emit('view-results', election)"
        >
          View Results
        </v-btn>
        <v-btn
          v-else
          color="info"
          variant="outlined"
          block
          prepend-icon="mdi-information"
          @click="$emit('view-details', election)"
        >
          View Details
        </v-btn>
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import TimerCountdown from './TimerCountdown.vue';

const props = defineProps({
  election: {
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
  showTimer: {
    type: Boolean,
    default: true
  },
  hasVoted: {
    type: Boolean,
    default: false
  }
});

defineEmits(['vote', 'view-results', 'view-details']);

const statusColor = computed(() => {
  const colors = {
    active: 'success',
    upcoming: 'info',
    ended: 'error'
  };
  return colors[props.election.status] || 'grey';
});

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};
</script>
