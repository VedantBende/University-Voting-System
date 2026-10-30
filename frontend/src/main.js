import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { clerkPlugin } from '@clerk/vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import './styles/globals.css';

const app = createApp(App);
const pinia = createPinia();

// Verify Clerk key
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.error('❌ VITE_CLERK_PUBLISHABLE_KEY is missing!');
  alert('Application configuration error. Please contact support.');
}

// Initialize Clerk with proper configuration
app.use(clerkPlugin, {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  afterSignInUrl: '/elections',
  afterSignUpUrl: '/elections',
  signInUrl: '/login',
  signUpUrl: '/signup'
});

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount('#app');

console.log('🚀 App initialized successfully');
