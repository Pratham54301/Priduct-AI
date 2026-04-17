'use client';

import * as React from 'react';
import {
  Search,
  Loader2,
  Trash2,
  Shield,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { adminService, type AdminUser } from '@/services/adminService';

export function UserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<'all' | 'user' | 'admin'>('all');
  const [membershipFilter, setMembershipFilter] = React.useState<'all' | 'free' | 'premium' | 'lifetime'>('all');

  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (membershipFilter !== 'all') params.set('membership', membershipFilter);
      params.set('limit', '100');
      const result = await adminService.getUsers(params);
      setUsers(result.data);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: 'Could not load admin user list.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [query, roleFilter, membershipFilter, toast]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleMembership = async (userId: string, membership: 'free' | 'premium' | 'lifetime') => {
    try {
      await adminService.updateMembership(userId, membership);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, membership } : u)));
      toast({ title: 'Membership updated', description: `User moved to ${membership} plan.` });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Could not update membership.',
        variant: 'destructive',
      });
    }
  };

  const handleRole = async (userId: string, role: 'user' | 'admin') => {
    try {
      await adminService.updateUser(userId, { role });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      toast({ title: 'Role updated', description: `User role updated to ${role}.` });
    } catch (error: any) {
      toast({
        title: 'Role update failed',
        description: error.message || 'Could not update role.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (userId: string) => {
    const ok = window.confirm('Delete this user? This will also remove their predictions and subscription records.');
    if (!ok) return;
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast({ title: 'User deleted', description: 'User removed successfully.' });
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message || 'Could not delete user.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await adminService.updateUserStatus(userId, isActive);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive } : u)));
      toast({
        title: isActive ? 'User enabled' : 'User disabled',
        description: `User account is now ${isActive ? 'active' : 'disabled'}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Status update failed',
        description: error.message || 'Could not update user status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              className="pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant={roleFilter === 'all' ? 'default' : 'outline'} onClick={() => setRoleFilter('all')}>All Roles</Button>
            <Button size="sm" variant={roleFilter === 'admin' ? 'default' : 'outline'} onClick={() => setRoleFilter('admin')}>Admins</Button>
            <Button size="sm" variant={membershipFilter === 'premium' ? 'default' : 'outline'} onClick={() => setMembershipFilter('premium')}>Premium</Button>
            <Button size="sm" variant={membershipFilter === 'all' ? 'default' : 'outline'} onClick={() => setMembershipFilter('all')}>Reset</Button>
          </div>
        </div>
        <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">No users found.</TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.fullName || user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive === false ? 'destructive' : 'default'}>
                          {user.isActive === false ? 'disabled' : 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.membership === 'free' ? 'secondary' : 'default'}>{user.membership}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleRole(user.id, 'user')}>User</Button>
                        <Button size="sm" variant="outline" onClick={() => handleRole(user.id, 'admin')}>Admin</Button>
                        <Button size="sm" variant="outline" onClick={() => handleMembership(user.id, 'free')}>Free</Button>
                        <Button size="sm" variant="outline" onClick={() => handleMembership(user.id, 'premium')}>Premium</Button>
                        <Button size="sm" variant="outline" onClick={() => handleMembership(user.id, 'lifetime')}>Lifetime</Button>
                        <Button size="sm" variant="outline" onClick={() => handleToggleActive(user.id, user.isActive === false)}>
                          <Shield className="mr-1 h-4 w-4" />
                          {user.isActive === false ? 'Enable' : 'Disable'}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
