import {
  Home,
  Users,
  LineChart,
  Crown,
  Settings,
} from 'lucide-react';
  
export const navItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/predictions', icon: LineChart, label: 'Prediction Logs' },
  { href: '/admin/premium', icon: Crown, label: 'Premium' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];
  
export const mobileNavItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard', badge: undefined },
  { href: '/admin/users', icon: Users, label: 'Users', badge: undefined },
  { href: '/admin/predictions', icon: LineChart, label: 'Prediction Logs', badge: undefined },
  { href: '/admin/premium', icon: Crown, label: 'Premium', badge: undefined },
  { href: '/admin/settings', icon: Settings, label: 'Settings', badge: undefined },
];
  
