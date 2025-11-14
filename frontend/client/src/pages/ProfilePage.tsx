import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        password: '',
        confirmPassword: ''
      });
      if (parsedUser.profileImage) {
        setPreviewImage(parsedUser.profileImage.replace('/src/uploads', '/api/uploads'));
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);

      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }

      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      const response = await api.put(`/users/update/${user.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update local storage with new user data
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Update error:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-vintage-parchment via-vintage-cream to-vintage-parchment">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-vintage-cream border-t-vintage-gold rounded-full animate-spin shadow-vintage-gold mx-auto"></div>
          <p className="mt-4 text-vintage-brown font-crimson-text text-xl animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-vintage-parchment via-vintage-cream to-vintage-parchment py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-linear-to-br from-vintage-ivory to-vintage-cream border-4 border-vintage-brown rounded-2xl shadow-vintage-heavy p-8">
          <h1 className="text-4xl font-playfair-display font-bold text-vintage-brown mb-8 text-center drop-shadow-lg">Profile Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={previewImage || 'https://via.placeholder.com/128x128?text=No+Image'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-vintage-brown shadow-vintage-light"
              />
              <label className="absolute bottom-0 right-0 bg-vintage-gold hover:bg-vintage-dark-gold text-vintage-brown p-3 rounded-full cursor-pointer shadow-vintage-medium border-2 border-vintage-brown hover:-translate-y-0.5 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-vintage-sepia font-crimson-text">Click the pencil icon to edit profile picture</p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-vintage-brown mb-2 font-crimson-text">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl bg-vintage-ivory text-vintage-brown placeholder-vintage-sepia/70 focus:outline-none focus:border-vintage-gold focus:ring-2 focus:ring-vintage-gold/20 transition-all duration-300 shadow-inner font-crimson-text ${
                errors.name ? 'border-vintage-rust' : 'border-vintage-brown'
              }`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="mt-1 text-sm text-vintage-burgundy font-crimson-text">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-vintage-brown mb-2 font-crimson-text">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl bg-vintage-ivory text-vintage-brown placeholder-vintage-sepia/70 focus:outline-none focus:border-vintage-gold focus:ring-2 focus:ring-vintage-gold/20 transition-all duration-300 shadow-inner font-crimson-text ${
                errors.email ? 'border-vintage-rust' : 'border-vintage-brown'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-vintage-burgundy font-crimson-text">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-vintage-brown mb-2 font-crimson-text">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl bg-vintage-ivory text-vintage-brown placeholder-vintage-sepia/70 focus:outline-none focus:border-vintage-gold focus:ring-2 focus:ring-vintage-gold/20 transition-all duration-300 shadow-inner font-crimson-text ${
                errors.password ? 'border-vintage-rust' : 'border-vintage-brown'
              }`}
              placeholder="Enter new password"
            />
            {errors.password && <p className="mt-1 text-sm text-vintage-burgundy font-crimson-text">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-vintage-brown mb-2 font-crimson-text">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-xl bg-vintage-ivory text-vintage-brown placeholder-vintage-sepia/70 focus:outline-none focus:border-vintage-gold focus:ring-2 focus:ring-vintage-gold/20 transition-all duration-300 shadow-inner font-crimson-text ${
                errors.confirmPassword ? 'border-vintage-rust' : 'border-vintage-brown'
              }`}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-vintage-burgundy font-crimson-text">{errors.confirmPassword}</p>}
          </div>

          {/* Points Display */}
          <div className="bg-linear-to-r from-vintage-cream to-vintage-antique-white p-6 rounded-xl border-2 border-vintage-terracotta shadow-vintage-light">
            <p className="text-lg text-vintage-sepia font-crimson-text text-center">
              <span className="font-bold text-vintage-brown">Current Points:</span> <span className="text-vintage-gold font-bold text-xl">{user.point}</span>
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-vintage-brown hover:bg-vintage-sepia text-vintage-ivory border-2 border-vintage-brown font-bold py-3 px-6 rounded-xl shadow-vintage-light hover:shadow-vintage-medium transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-vintage-gold hover:bg-vintage-dark-gold text-vintage-brown border-2 border-vintage-brown font-bold py-3 px-6 rounded-xl shadow-vintage-light hover:shadow-vintage-medium transition-all duration-300 hover:-translate-y-0.5"
            >
              Back to Home
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
