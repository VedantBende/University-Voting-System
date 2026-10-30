<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container-custom py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage elections and system</p>
          </div>
          <div class="flex items-center gap-3">
            <router-link to="/elections" class="btn btn-ghost">
              <v-icon size="18" start>mdi-account</v-icon>
              View as Student
              <v-icon size="18" end>mdi-arrow-right</v-icon>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container-custom py-8">
      <!-- Stats Grid -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="card card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Elections</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalElections }}</p>
            </div>
            <v-icon size="48" color="primary">mdi-vote</v-icon>
          </div>
        </div>

        <div class="card card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Active Now</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ stats.activeElections }}</p>
            </div>
            <v-icon size="48" color="success">mdi-check-circle</v-icon>
          </div>
        </div>

        <div class="card card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Votes</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalVotes }}</p>
            </div>
            <v-icon size="48" color="primary">mdi-account-group</v-icon>
          </div>
        </div>

        <div class="card card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalUsers }}</p>
            </div>
            <v-icon size="48" color="primary">mdi-school</v-icon>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card mb-8">
        <div class="card-header">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        </div>
        <div class="card-body">
          <div class="grid md:grid-cols-3 gap-4">
            <router-link to="/admin/elections/create" class="btn btn-primary w-full">
              <v-icon size="20" start>mdi-plus</v-icon>
              Create New Election
            </router-link>
            <router-link to="/admin/elections" class="btn btn-secondary w-full">
              <v-icon size="20" start>mdi-cog</v-icon>
              Manage Elections
            </router-link>
            <button class="btn btn-secondary w-full" disabled>
              <v-icon size="20" start>mdi-chart-bar</v-icon>
              View Reports (Coming Soon)
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Elections -->
      <div class="card">
        <div class="card-header flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Elections</h2>
          <router-link to="/admin/elections" class="text-primary-600 dark:text-primary-400 hover:underline text-sm flex items-center gap-1">
            View All
            <v-icon size="16">mdi-arrow-right</v-icon>
          </router-link>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="48" class="mx-auto mb-2"></v-progress-circular>
            <p class="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
          
          <div v-else-if="recentElections.length === 0" class="text-center py-12">
            <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-vote</v-icon>
            <p class="text-gray-600 dark:text-gray-400 mb-4">No elections created yet</p>
            <router-link to="/admin/elections/create" class="btn btn-primary">
              <v-icon size="18" start>mdi-plus</v-icon>
              Create First Election
            </router-link>
          </div>
          
          <div v-else class="space-y-3">
            <div v-for="election in recentElections" :key="election._id" 
                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ election.title }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  <v-icon size="14">mdi-calendar</v-icon>
                  {{ formatDate(election.startTime) }} - {{ formatDate(election.endTime) }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <span :class="getStatusBadgeClass(election.status)">
                  {{ election.status }}
                </span>
                <router-link :to="`/elections/${election._id}/results`" class="btn btn-sm btn-primary">
                  <v-icon size="16" start>mdi-eye</v-icon>
                  View
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const loading = ref(true);

const stats = ref({
  totalElections: 0,
  activeElections: 0,
  totalVotes: 0,
  totalUsers: 0
});

const recentElections = ref([]);

const fetchDashboardData = async () => {
  try {
    const [electionsRes, usersRes] = await Promise.all([
      axios.get(`${API_URL}/elections`),
      axios.get(`${API_URL}/auth/users/all`).catch(() => ({ data: { count: 0 } }))
    ]);
    
    recentElections.value = electionsRes.data.slice(0, 5);
    stats.value.totalElections = electionsRes.data.length;
    stats.value.activeElections = electionsRes.data.filter(e => e.status === 'active').length;
    stats.value.totalVotes = electionsRes.data.reduce((sum, e) => sum + (e.totalVotes || 0), 0);
    stats.value.totalUsers = usersRes.data.count || 0;
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
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
  document.title = 'Admin Dashboard - University Voting System';
  fetchDashboardData();
});
</script>
