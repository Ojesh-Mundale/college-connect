import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Check if we should navigate to dashboard after Google auth
    const shouldNavigateToDashboard = sessionStorage.getItem('navigateToDashboard');

    console.log('🎯 NavigationHandler check:', {
      shouldNavigateToDashboard,
      user: !!user,
      loading,
      currentPath: location.pathname
    });

    if (shouldNavigateToDashboard && user && !loading) {
      console.log('🎯 NavigationHandler: Navigating to dashboard after Google auth');
      sessionStorage.removeItem('navigateToDashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate, location.pathname]);

  return null; // This component doesn't render anything
};

export default NavigationHandler;
