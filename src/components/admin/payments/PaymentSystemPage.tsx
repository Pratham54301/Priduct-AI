'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  File,
  Menu,
  MoreHorizontal,
  Brain,
  Loader2,
} from 'lucide-react';

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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { ManualPaymentDialog } from './ManualPaymentDialog';
import { Payment } from '@/models/types';
import { getPayments } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';

export function PaymentSystemPage() {
  const { toast } = useToast();
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchPayments = React.useCallback(async () => {
      setIsLoading(true);
      try {
          const fetchedPayments = await getPayments();
          setPayments(fetchedPayments);
      } catch (error) {
          console.error("Failed to fetch payments:", error);
          toast({
              title: "Error fetching payments",
              description: "Could not load payment data. Please ensure Firebase is configured correctly.",
              variant: "destructive",
          });
      } finally {
          setIsLoading(false);
      }
  }, [toast]);

  React.useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);


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
           <h1 className="text-lg font-semibold md:text-2xl">Payments</h1>
        </div>
        <ThemeToggle />
        <UserMenu />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                    </span>
                </Button>
                <ManualPaymentDialog onSuccess={fetchPayments} />
            </div>
          </div>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Manage and view all user payments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                       <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : payments.length === 0 ? (
                       <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No payments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.map(payment => (
                        <TableRow key={payment.id}>
                            <TableCell>
                                <div className="font-medium">{payment.userEmail.split('@')[0]}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                {payment.userEmail}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={payment.status === 'Completed' ? 'default' : payment.status === 'Pending' ? 'secondary' : 'destructive'}>
                                {payment.status}
                                </Badge>
                            </TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                                    <DropdownMenuItem>Refund</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>{payments.length}</strong> payments
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
