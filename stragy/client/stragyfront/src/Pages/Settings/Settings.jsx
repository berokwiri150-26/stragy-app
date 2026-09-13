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


   return (
    <section style={styles.container}>
      <div style={styles.header}>
        <span style={styles.eyebrow}><Shield size={13} /> Account</span>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.intro}>Manage your account preferences and activity.</p>
      </div>

      <div style={styles.list}>
        {navItems.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} style={styles.row}>
            <div style={styles.iconBox}><Icon size={18} /></div>
            <div style={styles.textGroup}>
              <strong style={styles.rowTitle}>{title}</strong>
              <span style={styles.rowDesc}>{desc}</span>
            </div>
            <ChevronRight size={18} style={styles.chevron} />
          </Link>
        ))}

        {/* Danger Zone: Logout */}
        <div style={{ ...styles.row, ...styles.dangerRow }}>
          <div style={{ ...styles.iconBox, color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
            <LogOut size={18} />
          </div>
          <div style={styles.textGroup}>
            <strong style={styles.rowTitle}>Session</strong>
            <span style={styles.rowDesc}>Sign out of your account on this device</span>
          </div>
          <button type="button" onClick={handleSignOut} style={styles.logoutBtn}>
            Log out
          </button>
        </div>
      </div>
    </section>
  );
};