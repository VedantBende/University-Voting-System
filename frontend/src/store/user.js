import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isOfficer = computed(() => user.value?.role === 'officer');
  const isStudent = computed(() => user.value?.role === 'student');

  function setUser(userData) {
    user.value = userData;
  }

  function clearUser() {
    user.value = null;
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isOfficer,
    isStudent,
    setUser,
    clearUser
  };
});
