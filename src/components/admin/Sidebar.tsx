'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Brain, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navItems } from './navItems';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.div
      animate={{ width: collapsed ? 86 : 280 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="hidden border-r border-primary/20 bg-black/30 backdrop-blur-xl md:block"
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b border-primary/20 px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Brain className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            {!collapsed && <span className="text-cyan-100">PredictAI Admin</span>}
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8 border-primary/30 bg-black/30">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className={cn('grid items-start text-sm font-medium', collapsed ? 'px-2' : 'px-2 lg:px-4')}>
            {navItems.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-primary/10 hover:text-cyan-200',
                    pathname === item.href && 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.25)]',
                    collapsed && 'justify-center'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      </div>
    </motion.div>
  );
}

interface MobileSidebarProps {
  onNavigate?: () => void;
}

export function MobileSidebar({ onNavigate }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden border-primary/30 bg-black/30">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open admin navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] border-primary/20 bg-black/80 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-cyan-100">
            <Brain className="h-5 w-5 text-cyan-400" />
            PredictAI Admin
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-primary/10 hover:text-cyan-200',
                pathname === item.href && 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-100'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
