import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Activity, MessageSquare, LogOut, ChevronRight, Shield } from 'lucide-react';
import theme from '../../theme';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileId = user?.id || user?.user_id;

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: `/profile/${profileId}/edit`,
      icon: User,
      title: 'Account Management',
      desc: 'Update profile details and preferences',
    },
    {
      to: '/Viewed',
      icon: Activity,
      title: '',
      desc: 'Review viewed posts and history',
    },
    {
      to: '/Discover',
      icon: MessageSquare,
      title: 'New Logs',
      desc: 'Open feed and community discussions',
    },
  ];