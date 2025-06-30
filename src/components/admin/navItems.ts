import {
    Home,
    Users,
    LineChart,
    CalendarCheck,
    CreditCard,
    Trophy,
  } from 'lucide-react';
  
  export const navItems = [
    { href: '/admin-panel', icon: Home, label: 'Dashboard' },
    { href: '/admin-panel/users', icon: Users, label: 'Users' },
    { href: '/admin-panel/schedule', icon: CalendarCheck, label: 'Schedule' },
    { href: '/admin-panel/payments', icon: CreditCard, label: 'Payments' },
    { href: '/admin-panel/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '#', icon: LineChart, label: 'Analytics' },
  ];
  
  export const mobileNavItems = [
    { href: '/admin-panel', icon: Home, label: 'Dashboard', badge: undefined },
    { href: '/admin-panel/users', icon: Users, label: 'Users', badge: '12' },
    { href: '/admin-panel/schedule', icon: CalendarCheck, label: 'Schedule', badge: undefined },
    { href: '/admin-panel/payments', icon: CreditCard, label: 'Payments', badge: undefined },
    { href: '/admin-panel/leaderboard', icon: Trophy, label: 'Leaderboard', badge: undefined },
    { href: '#', icon: LineChart, label: 'Analytics', badge: undefined },
  ]
  