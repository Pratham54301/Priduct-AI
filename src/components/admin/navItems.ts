import {
    Home,
    Users,
    LineChart,
    CalendarCheck,
    CreditCard,
    Trophy,
  } from 'lucide-react';
  
  export const navItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/schedule', icon: CalendarCheck, label: 'Schedule' },
    { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { href: '/admin/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/admin/analytics', icon: LineChart, label: 'Analytics' },
  ];
  
  export const mobileNavItems = [
    { href: '/admin', icon: Home, label: 'Dashboard', badge: undefined },
    { href: '/admin/users', icon: Users, label: 'Users', badge: '12' },
    { href: '/admin/schedule', icon: CalendarCheck, label: 'Schedule', badge: undefined },
    { href: '/admin/payments', icon: CreditCard, label: 'Payments', badge: undefined },
    { href: '/admin/leaderboard', icon: Trophy, label: 'Leaderboard', badge: undefined },
    { href: '/admin/analytics', icon: LineChart, label: 'Analytics', badge: undefined },
  ]
  
