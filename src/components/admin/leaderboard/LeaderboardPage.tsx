'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Download,
  Filter,
  Menu,
  MoreHorizontal,
  PlusCircle,
  RotateCcw,
  Search,
  Brain,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from '../UserMenu';
import { mobileNavItems } from '../navItems';
import { useToast } from '@/hooks/use-toast';

const leaderboardData = [
  { rank: 1, name: 'Priya S.', score: 12500, accuracy: '92.5%', trades: 150 },
  { rank: 2, name: 'Raj K.', score: 11800, accuracy: '88.2%', trades: 210 },
  { rank: 3, name: 'Vikram Singh', score: 11500, accuracy: '85.0%', trades: 180 },
  { rank: 4, name: 'Anita D.', score: 10900, accuracy: '91.1%', trades: 120 },
  { rank: 5, name: 'John Smith', score: 10500, accuracy: '82.5%', trades: 250 },
  { rank: 6, name: 'Suresh P.', score: 9800, accuracy: '78.9%', trades: 190 },
  { rank: 7, name: 'Emily Chen', score: 9500, accuracy: '90.3%', trades: 140 },
];

export function LeaderboardPage() {
  const { toast } = useToast();

  const handleResetScores = () => {
    toast({
      title: 'Scores Reset!',
      description: 'The leaderboard scores have been successfully reset.',
    });
  };

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
            <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold mb-4"
              >
                <Brain className="h-6 w-6 text-primary" />
                <span>PredictAI Admin</span>
              </Link>
              {mobileNavItems.map((item) => (
                 <Link
                  key={item.label}
                  href={item.href}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
           <h1 className="text-lg font-semibold md:text-2xl">Leaderboard</h1>
        </div>
        <ThemeToggle />
        <UserMenu />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>
                Manage user rankings and leaderboard data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4 mb-4">
                 <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search users..." className="pl-8" />
                 </div>
                 <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset Scores
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently reset all user scores on the leaderboard.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleResetScores}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download CSV
                    </Button>
                 </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Trades</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((user) => (
                    <TableRow key={user.rank}>
                      <TableCell className="font-medium">{user.rank}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.score}</TableCell>
                      <TableCell>
                        <Badge variant={parseFloat(user.accuracy) > 90 ? 'default' : 'secondary'}>
                            {user.accuracy}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.trades}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Reset User Score</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Remove from Leaderboard
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-7</strong> of <strong>32</strong> users
              </div>
            </CardFooter>
          </Card>
      </main>
    </>
  );
}
