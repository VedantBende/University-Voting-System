import { ref } from 'vue';
import { useAuth, useUser } from '@clerk/vue';
import { useRouter } from 'vue-router';
import api from '@/utils/api';

export function useUserCheck() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const loading = ref(false);
  const error = ref(null);

  const checkAndRedirect = async () => {
    if (!isSignedIn.value || !user.value) {
      console.log('User not signed in with Clerk');
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      const email = user.value.emailAddresses[0]?.emailAddress;
      
      if (!email) {
        console.error('No email found for user');
        router.push('/user-not-found');
        return false;
      }

      // Check if user exists in our database
      const response = await api.post('/auth/check-user', {
        clerkId: userId.value,
        email: email
      });

      if (response.data.exists) {
        console.log('✅ User exists in database:', response.data.user.email);
        return true;
      } else {
        console.log('❌ User not in database');
        
        // Try to auto-sync
        try {
          await api.post('/auth/sync', {
            clerkId: userId.value,
            email: email,
            firstName: user.value.firstName || '',
            lastName: user.value.lastName || ''
          });
          
          console.log('✅ User auto-synced to database');
          return true;
        } catch (syncError) {
          console.error('Failed to auto-sync user:', syncError);
          // Redirect to user not found page with explanation
          router.push('/user-not-found');
          return false;
        }
      }
    } catch (err) {
      console.error('Error checking user:', err);
      error.value = err.message;
      
      // If user doesn't exist, show the not found page
      if (err.response?.status === 404 || err.response?.status === 403) {
        router.push('/user-not-found');
      }
      
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    checkAndRedirect,
    loading,
    error
  };
}
