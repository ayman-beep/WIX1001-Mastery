import React from 'react';
import { Dashboard } from '../components/Dashboard';
import { AppRoute } from '../types';

interface DashboardPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  return <Dashboard onNavigate={onNavigate} />;
};
