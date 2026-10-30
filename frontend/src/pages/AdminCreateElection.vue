<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container-custom py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/admin" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              <v-icon size="20" start>mdi-arrow-left</v-icon>
              Back to Admin
            </router-link>
            <h1 class="text-xl font-bold">Create New Election</h1>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container-custom py-8">
      <ElectionForm @success="handleSuccess" @cancel="handleCancel" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ElectionForm from '@/components/admin/ElectionForm.vue';

const router = useRouter();

const handleSuccess = (data) => {
  alert(`Election "${data.election.title}" created successfully!`);
  router.push('/admin/elections');
};

const handleCancel = () => {
  router.push('/admin');
};
</script>
