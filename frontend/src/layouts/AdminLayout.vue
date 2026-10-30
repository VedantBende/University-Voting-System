<template>
  <v-app>
    <Navbar />
    
    <Sidebar
      v-model="drawer"
      :items="adminMenuItems"
      :user-name="userName"
      user-role="Admin"
      :permanent="$vuetify.display.mdAndUp"
    />

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuth } from '@clerk/vue';
import Navbar from '@components/common/Navbar.vue';
import Sidebar from '@components/common/Sidebar.vue';
import Footer from '@components/common/Footer.vue';

const { user } = useAuth();
const drawer = ref(true);

const userName = computed(() => {
  return user.value?.fullName || user.value?.primaryEmailAddress?.emailAddress || 'Admin';
});

const adminMenuItems = [
  {
    text: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/admin'
  },
  {
    text: 'Elections',
    icon: 'mdi-vote',
    to: '/admin/elections'
  },
  {
    text: 'Create Election',
    icon: 'mdi-plus-circle',
    to: '/admin/elections/create'
  },
  {
    text: 'Candidates',
    icon: 'mdi-account-group',
    to: '/admin/candidates'
  },
  {
    text: 'Users',
    icon: 'mdi-account-multiple',
    to: '/admin/users'
  },
  {
    text: 'Reports',
    icon: 'mdi-chart-bar',
    to: '/admin/reports'
  },
  {
    text: 'Settings',
    icon: 'mdi-cog',
    to: '/admin/settings'
  }
];
</script>
