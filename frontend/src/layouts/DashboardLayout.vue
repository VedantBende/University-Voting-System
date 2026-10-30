<template>
  <v-app>
    <Navbar />

    <v-main>
      <v-container fluid>
        <!-- Breadcrumbs -->
        <v-breadcrumbs
          v-if="breadcrumbs.length > 0"
          :items="breadcrumbs"
          class="px-0 pt-4 pb-2"
        >
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>

        <!-- Page Content -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <Footer />

    <!-- Scroll to Top Button -->
    <v-fab
      v-if="showScrollTop"
      icon="mdi-chevron-up"
      location="bottom end"
      size="small"
      color="primary"
      @click="scrollToTop"
      class="mb-16"
    ></v-fab>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@components/common/Navbar.vue';
import Footer from '@components/common/Footer.vue';

const route = useRoute();
const showScrollTop = ref(false);

// Generate breadcrumbs from route
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(p => p);
  const crumbs = [{ title: 'Home', to: '/', disabled: false }];
  
  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    const title = path.charAt(0).toUpperCase() + path.slice(1);
    crumbs.push({
      title,
      to: currentPath,
      disabled: index === paths.length - 1
    });
  });
  
  return crumbs;
});

// Scroll to top functionality
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
