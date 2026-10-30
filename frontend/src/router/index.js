import { createRouter, createWebHistory } from 'vue-router';
import { useAuth, useUser } from '@clerk/vue';


const routes = [
  // ========== Public Routes ==========
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { 
      requiresAuth: false,
      title: 'Home - University Voting System'
    }
  },
  
  // ========== Authentication Routes ==========
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { 
      requiresAuth: false,
      title: 'Login - University Voting System',
      redirectIfAuthenticated: true
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/pages/SignUpPage.vue'),
    meta: { 
      requiresAuth: false,
      title: 'Sign Up - University Voting System',
      redirectIfAuthenticated: true
    }
  },
  
  // ========== Email Verification Route ==========
  {
    path: '/signup/verify-email-address',
    name: 'VerifyEmail',
    component: () => import('@/pages/SignUpPage.vue'),
    meta: { 
      title: 'Verify Email - University Voting System',
      isCallback: true
    }
  },
  
  // ========== SSO Callback Routes ==========
  {
    path: '/login/sso-callback',
    name: 'LoginSSOCallback',
    component: () => import('@/pages/SSOCallbackPage.vue'),
    meta: { 
      title: 'Completing Sign In...',
      isCallback: true
    }
  },
  {
    path: '/signup/sso-callback',
    name: 'SignUpSSOCallback',
    component: () => import('@/pages/SignUpCallbackPage.vue'),
    meta: { 
      title: 'Completing Registration...',
      isCallback: true
    }
  },
  
  // ========== Error/Status Routes ==========
  {
    path: '/user-not-found',
    name: 'UserNotFound',
    component: () => import('@/pages/UserNotFoundPage.vue'),
    meta: { 
      requiresAuth: true,
      title: 'User Not Found - University Voting System'
    }
  },
  
  // ========== Protected Routes ==========
  {
    path: '/elections',
    name: 'Elections',
    component: () => import('@/pages/ElectionsPage.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Elections - University Voting System'
    }
  },
  {
    path: '/elections/:id/vote',
    name: 'Vote',
    component: () => import('@/pages/VotePage.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Cast Your Vote - University Voting System'
    }
  },
  {
    path: '/elections/:id/results',
    name: 'Results',
    component: () => import('@/pages/ResultsPage.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Election Results - University Voting System'
    }
  },
  {
    path: '/results/:id',
    redirect: to => `/elections/${to.params.id}/results`
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/ProfilePage.vue'),
    meta: { 
      requiresAuth: true,
      title: 'My Profile - University Voting System'
    }
  },
  
  // ========== Admin Routes ==========
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/pages/AdminDashboard.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Admin Dashboard - University Voting System'
    }
  },
  {
    path: '/admin/elections',
    name: 'AdminManageElections',
    component: () => import('@/pages/AdminElectionsPage.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Manage Elections - University Voting System'
    }
  },
  {
    path: '/admin/elections/create',
    name: 'AdminCreateElection',
    component: () => import('@/pages/AdminCreateElection.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Create Election - University Voting System'
    }
  },
  {
    path: '/admin/elections/:id/candidates',
    name: 'ManageCandidates',
    component: () => import('@/pages/ManageCandidatesPage.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Manage Candidates - University Voting System'
    }
  },
  
  // ========== 404 Not Found Route ==========
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { 
      title: '404 - Page Not Found',
      requiresAuth: false
    }
  }
];


// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});


// Global navigation guard
router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }


  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();


  // Wait for Clerk to load
  let waitCount = 0;
  while (!isLoaded.value && waitCount < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    waitCount++;
  }


  if (import.meta.env.DEV) {
    console.log(`[Router] Navigating from ${from.path} to ${to.path}`);
    console.log(`[Router] isSignedIn: ${isSignedIn.value}`);
  }


  // Allow SSO callback routes and verification
  if (to.meta.isCallback) {
    console.log('[Router] Callback/verification route, allowing navigation');
    next();
    return;
  }


  // Check authentication
  if (to.meta.requiresAuth) {
    if (!isSignedIn.value) {
      console.log('[Router] Auth required but user not signed in');
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }


    // ✅ PERMANENT FIX: Check admin role from Clerk metadata
    if (to.meta.requiresAdmin) {
      // Wait for user to load
      let userWait = 0;
      while (!user.value && userWait < 30) {
        await new Promise(resolve => setTimeout(resolve, 100));
        userWait++;
      }


      if (!user.value) {
        console.error('[Router] User not loaded after waiting');
        alert('Unable to verify permissions. Please refresh the page and try again.');
        next('/elections');
        return;
      }


      // Check role from Clerk public metadata
      const userRole = user.value.publicMetadata?.role;
      const userEmail = user.value.primaryEmailAddress?.emailAddress;
      
      console.log('[Router] Checking admin access:');
      console.log('  - Email:', userEmail);
      console.log('  - Role from Clerk metadata:', userRole);


      if (userRole !== 'admin' && userRole !== 'officer') {
        console.log('🚫 [Router] Access denied - insufficient permissions');
        alert(
          `Access Denied!\n\n` +
          `Only administrators can access this page.\n\n` +
          `Your email: ${userEmail}\n` +
          `Your role: ${userRole || 'student'}\n\n` +
          `If you should have admin access, please contact an administrator to update your permissions in Clerk.`
        );
        next('/elections');
        return;
      }


      console.log('✅ [Router] Admin access granted');
    }


    next();
    return;
  }


  // Redirect if already authenticated
  if (to.meta.redirectIfAuthenticated && isSignedIn.value) {
    console.log('[Router] User already authenticated, redirecting to elections');
    next('/elections');
    return;
  }


  next();
});


router.afterEach((to, from) => {
  if (import.meta.env.DEV) {
    console.log(`[Router] Successfully navigated to ${to.path}`);
  }
});


router.onError((error) => {
  console.error('[Router] Navigation error:', error);
});


export default router;
