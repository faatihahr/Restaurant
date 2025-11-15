import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useSignOut = () => {
  const { logout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    // Add a small delay for better UX
    setTimeout(() => {
      logout();
      setIsSigningOut(false);
    }, 1500); // 1.5 second delay
  };

  return {
    isSigningOut,
    handleSignOut,
  };
};
