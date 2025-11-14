import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await axios.post('http://localhost:3000/api/users/register', registerData);
      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-vintage-parchment via-vintage-cream to-vintage-parchment px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-playfair-display font-bold text-vintage-brown mb-4 drop-shadow-lg">
            Create your account
          </h2>
          <p className="text-vintage-sepia font-crimson-text">
            Or{' '}
            <Link to="/sign-in" className="font-semibold text-vintage-gold hover:text-vintage-dark-gold underline decoration-vintage-gold underline-offset-4 hover:decoration-vintage-dark-gold transition-colors">
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="bg-linear-to-br from-vintage-ivory to-vintage-cream border-4 border-vintage-brown rounded-2xl p-8 shadow-vintage-heavy space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-vintage-rust/10 border-2 border-vintage-rust text-vintage-burgundy px-6 py-4 rounded-xl font-crimson-text shadow-vintage-light">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-vintage-brown mb-2 font-crimson-text">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 border-2 border-vintage-brown rounded-2xl bg-vintage-ivory text-vintage-brown placeholder-vintage-sepia/70 focus:outline-none focus:border-vintage-gold focus:ring-2 focus:ring-vintage-gold/20 transition-all duration-300 shadow-inner font-crimson-text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
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
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-vintage-brown mb-2 font-crimson-text">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full px-4 py-3 border-2 border-vintage-brown rounded-2xl bg-vintage-ivory text-vintage-brown placeholder-vintage-sepia/70 focus:outline-none focus:border-vintage-gold focus:ring-2 focus:ring-vintage-gold/20 transition-all duration-300 shadow-inner font-crimson-text"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="max-w-xs bg-vintage-brown hover:bg-vintage-sepia text-vintage-ivory border-2 border-vintage-brown font-bold py-3 px-6 rounded-2xl shadow-vintage-light hover:shadow-vintage-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
