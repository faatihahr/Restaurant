import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';

export default function SignInPage() {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="max-w-lg w-full shadow-lg border border-border p-6 sm:p-12">
        <div className="flex justify-start mb-4 sm:mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="vintageOutline"
            size="sm"
            className="flex items-center gap-2 rounded-2xl"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Button>
        </div>
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-playfair-display font-bold text-vintage-brown mb-4 drop-shadow-lg">
            Sign in to your account
          </h2>
          <p className="text-sm sm:text-base text-vintage-sepia font-crimson-text">
            Or{' '}
            <Link to="/sign-up" className="font-semibold text-vintage-gold hover:text-vintage-dark-gold underline decoration-vintage-gold underline-offset-4 hover:decoration-vintage-dark-gold transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-vintage-rust/10 border-2 border-vintage-rust text-vintage-burgundy px-6 py-4 rounded-xl font-crimson-text shadow-vintage-light">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-vintage-brown mb-2 font-crimson-text">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border-2 border-vintage-brown rounded-2xl bg-vintage-ivory text-vintage-brown placeholder-vintage-sepia/70 focus:outline-none focus:border-vintage-gold focus:ring-2 focus:ring-vintage-gold/20 transition-all duration-300 shadow-inner font-crimson-text"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-vintage-brown mb-2 font-crimson-text">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border-2 border-vintage-brown rounded-2xl bg-vintage-ivory text-vintage-brown placeholder-vintage-sepia/70 focus:outline-none focus:border-vintage-gold focus:ring-2 focus:ring-vintage-gold/20 transition-all duration-300 shadow-inner font-crimson-text"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              variant="vintage"
              size="lg"
              className="max-w-xs rounded-2xl"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
