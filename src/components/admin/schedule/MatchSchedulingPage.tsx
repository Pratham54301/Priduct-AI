
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarIcon,
  Menu,
  MoreHorizontal,
  Brain,
  Loader2,
} from 'lucide-react';
import { format } from "date-fns"

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from '../UserMenu';
import { mobileNavItems } from '../navItems';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Schedule } from '@/models/types';
import { getSchedules, addSchedule } from '@/services/scheduleService';


const scheduleSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    date: z.date({
        required_error: "A date is required.",
    }),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
    type: z.enum(['Crypto', 'Stock', 'Currency']),
    description: z.string().optional(),
});

export function MatchSchedulingPage() {
    const { toast } = useToast();
    const [schedules, setSchedules] = React.useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const form = useForm<z.infer<typeof scheduleSchema>>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            title: '',
            time: '',
            type: 'Stock',
            description: '',
        }
    });

    const fetchSchedules = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedSchedules = await getSchedules();
            setSchedules(fetchedSchedules);
        } catch (error) {
            console.error("Failed to fetch schedules:", error);
            toast({
                title: "Error fetching schedules",
                description: "Could not load schedule data. Please ensure Firebase is configured correctly.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);
    
    React.useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);


    const onSubmit = (data: z.infer<typeof scheduleSchema>) => {
        console.log(data);
        // This is where you would call addSchedule(data)
        // For now, it just shows a toast.
        toast({
            title: "Match Scheduled!",
            description: `"${data.title}" has been successfully scheduled for ${format(data.date, "PPP")} at ${data.time}.`,
        });
        form.reset();
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
           <h1 className="text-lg font-semibold md:text-2xl">Match Scheduling</h1>
        </div>
        <ThemeToggle />
        <UserMenu />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Schedule New Match</CardTitle>
                    <CardDescription>Set up a new prediction window or contest.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField name="title" control={form.control} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField name="date" control={form.control} render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < new Date("1900-01-01")} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField name="time" control={form.control} render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Time (HH:MM)</FormLabel>
                                        <FormControl><Input {...field} placeholder="14:30" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                             <FormField name="type" control={form.control} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select match type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Stock">Stock</SelectItem>
                                            <SelectItem value="Crypto">Crypto</SelectItem>
                                            <SelectItem value="Currency">Currency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                             )}/>
                              <FormField name="description" control={form.control} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea placeholder="Optional: Add a brief description..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <Button type="submit" className="w-full">Schedule Match</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
             <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Upcoming & Recent Matches</CardTitle>
                 <CardDescription>View and manage all scheduled matches.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {isLoading ? (
                       <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : schedules.length === 0 ? (
                       <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No schedules found.
                        </TableCell>
                      </TableRow>
                    ) : (
                    schedules.map(match => (
                        <TableRow key={match.id}>
                            <TableCell className="font-medium">{match.title}</TableCell>
                            <TableCell>{match.type}</TableCell>
                            <TableCell>{match.date}</TableCell>
                            <TableCell><Badge variant={match.status === 'Live' ? 'destructive' : 'secondary'}>{match.status}</Badge></TableCell>
                            <TableCell>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Cancel</DropdownMenuItem>
                                        <DropdownMenuItem>View Participants</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
