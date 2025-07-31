'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { findUserByEmail } from '@/services/userService';
import { addPayment } from '@/services/paymentService';

const paymentSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  status: z.enum(['Completed', 'Pending', 'Failed']),
});

interface ManualPaymentDialogProps {
  onSuccess: () => void;
}

export function ManualPaymentDialog({ onSuccess }: ManualPaymentDialogProps) {
    const { toast } = useToast();
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const form = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            email: '',
            amount: 0,
            status: 'Completed',
        },
    });

    const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
        setIsLoading(true);
        try {
            const user = await findUserByEmail(values.email);
            if (!user) {
                toast({
                    title: "User Not Found",
                    description: "No user exists with that email address. Please check the email and try again.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            const paymentData = {
                userId: user.id,
                userEmail: values.email,
                amount: values.amount,
                status: values.status,
                date: new Date().toISOString(),
            };

            await addPayment(paymentData);

            toast({
                title: 'Payment Recorded',
                description: `Payment of $${values.amount} for ${values.email} has been successfully recorded.`,
            });
            onSuccess(); // Trigger the refresh on the parent page
            setOpen(false);
            form.reset();

        } catch (error) {
            console.error("Failed to record payment:", error);
            toast({
                title: "Error Recording Payment",
                description: "Could not save the payment. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Manual Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manual Payment Entry</DialogTitle>
          <DialogDescription>
            Record a new payment manually. This will appear in the payment history.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User Email</FormLabel>
                            <FormControl>
                                <Input placeholder="user@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount ($)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="50.00" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Payment
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
