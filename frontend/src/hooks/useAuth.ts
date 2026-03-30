import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { loginUser, registerUser } from '../services/api';
import type { LoginInput, RegisterInput } from '../types/auth';

export function useAuth() {
  const { user, token, isLoading, login, logout, isAuthenticated } = useAuthContext();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (input: LoginInput) => {
    setError('');
    setIsSubmitting(true);
    try {
      const data = await loginUser(input);
      login(data.token, data.refreshToken, data.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (input: RegisterInput) => {
    setError('');
    setIsSubmitting(true);
    try {
      const data = await registerUser(input);
      login(data.token, data.refreshToken, data.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    isSubmitting,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}
