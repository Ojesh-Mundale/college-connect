import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Don't redirect if already on auth-related pages
    const authPages = ['/login', '/register', '/confirm', '/onboarding'];
    if (authPages.includes(location.pathname)) {
      return;
    }

    if (!loading && user) {
      // Check if we should navigate to dashboard after Google auth
      const shouldNavigateToDashboard = sessionStorage.getItem('navigateToDashboard');

      console.log('🎯 NavigationHandler check:', {
        shouldNavigateToDashboard,
        user: !!user,
        isOnboarded: user.isOnboarded,
        loading,
        currentPath: location.pathname
      });

      // If user is not onboarded, redirect to onboarding
      if (!user.isOnboarded) {
        console.log('🎯 NavigationHandler: User not onboarded, redirecting to onboarding');
        navigate('/onboarding', { replace: true });
        return;
      }

      // If Google auth flag is set and user is onboarded, go to dashboard
      if (shouldNavigateToDashboard && user.isOnboarded) {
        console.log('🎯 NavigationHandler: Navigating to dashboard after Google auth');
        sessionStorage.removeItem('navigateToDashboard');
        navigate('/feed', { replace: true });
      }
    }
  }, [user?.isOnboarded, loading, navigate, location.pathname]);

  return null; // This component doesn't render anything
};

export default NavigationHandler;
