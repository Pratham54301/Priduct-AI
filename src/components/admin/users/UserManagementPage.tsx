'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  File,
  ListFilter,
  Menu,
  MoreHorizontal,
  PlusCircle,
  Search,
  Brain,
  Loader2,
  ShieldAlert,
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
import { User } from '@/models/types';
import { getUsers, deleteUser, updateUserRole } from '@/services/userService';

export function UserManagementPage() {
    const { toast } = useToast();
    const [users, setUsers] = React.useState<User[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openPromoteDialog, setOpenPromoteDialog] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

    const fetchUsers = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast({
                title: "Error fetching users",
                description: "Could not load user data. Please ensure Firebase is configured correctly.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            await deleteUser(selectedUser.id);
            setUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));
            toast({
                title: "User Deleted",
                description: `User ${selectedUser.fullName} has been successfully deleted.`,
                variant: "destructive"
            });
        } catch (error) {
             console.error("Failed to delete user:", error);
             toast({
                title: "Error deleting user",
                description: "Could not delete user. Please try again.",
                variant: "destructive",
            });
        } finally {
            setOpenDeleteDialog(false);
            setSelectedUser(null);
        }
    }

    const handlePromote = async () => {
      if (!selectedUser) return;
      try {
        await updateUserRole(selectedUser.id, 'Admin');
        setUsers(prevUsers => prevUsers.map(u => u.id === selectedUser.id ? { ...u, role: 'Admin' } : u));
        toast({
          title: "User Promoted!",
          description: `${selectedUser.fullName} has been successfully promoted to an Admin.`,
        });
      } catch (error) {
        console.error("Failed to promote user:", error);
        toast({
          title: "Error Promoting User",
          description: "Could not promote user. Please try again.",
          variant: "destructive",
        });
      } finally {
        setOpenPromoteDialog(false);
        setSelectedUser(null);
      }
    };

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="shrink-0 md:hidden border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9" type="button">
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
                   {item.badge && (
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        <ThemeToggle />
        <UserMenu />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-8 gap-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground" type="button">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Role
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Status</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="h-8 gap-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Button className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add User
                </span>
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage your users and view their details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Joined Date
                      </TableHead>
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
                    ) : users.length === 0 ? (
                       <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                <div>{user.fullName}</div>
                                <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Badge className={user.status === 'Active' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}>
                                  {user.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {user.joined}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                    aria-haspopup="true"
                                    className="bg-transparent hover:bg-accent hover:text-accent-foreground h-9 w-9"
                                    >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>View</DropdownMenuItem>
                                    {user.role !== 'Admin' && (
                                      <DropdownMenuItem onClick={() => { setSelectedUser(user); setOpenPromoteDialog(true); }}>
                                        Promote to Admin
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedUser(user); setOpenDeleteDialog(true); }}>
                                        Delete
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
                  Showing <strong>{users.length}</strong> users
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the user account for {selectedUser?.fullName} and remove their data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={openPromoteDialog} onOpenChange={setOpenPromoteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <ShieldAlert className="text-primary h-6 w-6" />
                Confirm Promotion
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to promote {selectedUser?.fullName} to an Admin role? They will gain full access to the admin panel. This action can be reversed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePromote}>Promote User</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  );
}
