import React from 'react';
import { render, screen } from '@testing-library/react';
import ParentDashboard from './ParentDashboard';

// Mock the DashboardSwitcher component
jest.mock('../../components/common/DashboardSwitcher', () => {
  return function DashboardSwitcher() {
    return <div data-testid="dashboard-switcher">Dashboard Switcher</div>;
  };
});

// Mock the usePageTitle hook
jest.mock('../../hooks/usePageTitle');

describe('ParentDashboard', () => {
  test('renders parent dashboard with correct title', () => {
    render(<ParentDashboard />);
    
    // Check if the main title is rendered
    expect(screen.getByText('لوحة تحكم أولياء الأمور')).toBeInTheDocument();
    
    // Check if the dashboard switcher is rendered
    expect(screen.getByTestId('dashboard-switcher')).toBeInTheDocument();
  });

  test('renders sidebar navigation items', () => {
    render(<ParentDashboard />);
    
    // Check if sidebar items are rendered
    expect(screen.getByText('نظرة عامة')).toBeInTheDocument();
    expect(screen.getByText('البحث عن مدارس')).toBeInTheDocument();
    expect(screen.getByText('الشكاوى')).toBeInTheDocument();
    expect(screen.getByText('التقييمات')).toBeInTheDocument();
    expect(screen.getByText('مقارنة المدارس')).toBeInTheDocument();
    expect(screen.getByText('الإعدادات')).toBeInTheDocument();
  });

  test('renders overview tab by default', () => {
    render(<ParentDashboard />);
    
    // Check if stats cards are rendered
    expect(screen.getByText('الأبناء المسجلين')).toBeInTheDocument();
    expect(screen.getByText('المدارس المفضلة')).toBeInTheDocument();
    expect(screen.getByText('الشكاوى المقدمة')).toBeInTheDocument();
    expect(screen.getByText('التقييمات المقدمة')).toBeInTheDocument();
  });
});