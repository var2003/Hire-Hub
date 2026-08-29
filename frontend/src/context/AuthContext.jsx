import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stored user on launch
    const storedUser = localStorage.getItem('hirehub_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('hirehub_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('hirehub_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const data = response.data;
    setUser(data);
    localStorage.setItem('hirehub_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hirehub_user');
  };

  const updateUserProfile = async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    const updated = response.data;
    setUser(updated);
    localStorage.setItem('hirehub_user', JSON.stringify(updated));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        isApplicant: user?.role === 'applicant',
        isRecruiter: user?.role === 'recruiter'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
