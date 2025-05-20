import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  UserIcon,
  ShieldAlertIcon,
  EyeIcon,
  PenIcon,
  TrashIcon,
  SearchIcon,
  RefreshCcw,
  LoaderIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateUserForm } from "@/components/users/create-user-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Define the User interface
interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'editor' | 'viewer';
  department?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: 1,
    username: "johndoe",
    email: "john.doe@akses.com",
    fullName: "John Doe",
    role: "admin",
    department: "Management",
    isActive: true,
    lastLogin: new Date("2025-05-10T10:30:00"),
    createdAt: new Date("2024-01-15")
  },
  {
    id: 2,
    username: "janesmith",
    email: "jane.smith@akses.com",
    fullName: "Jane Smith",
    role: "editor",
    department: "Finance",
    isActive: true,
    lastLogin: new Date("2025-05-11T14:20:00"),
    createdAt: new Date("2024-01-20")
  },
  {
    id: 3,
    username: "robertjohnson",
    email: "robert.johnson@akses.com",
    fullName: "Robert Johnson",
    role: "viewer",
    department: "Analytics",
    isActive: true,
    lastLogin: new Date("2025-05-12T09:15:00"),
    createdAt: new Date("2024-02-01")
  },
  {
    id: 4,
    username: "sarahbrown",
    email: "sarah.brown@akses.com",
    fullName: "Sarah Brown",
    role: "editor",
    department: "Deals",
    isActive: false,
    createdAt: new Date("2024-02-15")
  },
  {
    id: 5,
    username: "michaelwilson",
    email: "michael.wilson@akses.com",
    fullName: "Michael Wilson",
    role: "admin",
    department: "IT",
    isActive: true,
    lastLogin: new Date("2025-05-13T11:45:00"),
    createdAt: new Date("2024-03-01")
  },
  {
    id: 6,
    username: "emilydavis",
    email: "emily.davis@akses.com",
    fullName: "Emily Davis",
    role: "viewer",
    department: "Research",
    isActive: true,
    lastLogin: new Date("2025-05-09T16:30:00"),
    createdAt: new Date("2024-03-15")
  },
  {
    id: 7,
    username: "davidmiller",
    email: "david.miller@akses.com",
    fullName: "David Miller",
    role: "viewer",
    department: "Credit",
    isActive: true,
    lastLogin: new Date("2025-05-10T08:45:00"),
    createdAt: new Date("2024-04-01")
  }
];

export function UserManagement() {
  const [filter, setFilter] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch users from API
  const { 
    data: users = [], 
    isLoading,
    isError,
    refetch 
  } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/users');
      const data = await response.json();
      return data as User[];
    },
  });
  
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest('POST', '/api/users', userData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setOpenDialog(false);
      toast({
        title: "User created",
        description: "The user has been successfully created",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest('DELETE', `/api/users/${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update user status mutation
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: number, isActive: boolean }) => {
      const response = await apiRequest('PATCH', `/api/users/${userId}`, { isActive });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "User updated",
        description: "The user status has been successfully updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Filter users based on search input
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(filter.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.toLowerCase()) ||
    (user.fullName && user.fullName.toLowerCase().includes(filter.toLowerCase())) ||
    (user.department && user.department.toLowerCase().includes(filter.toLowerCase()))
  );
  
  // Separate users by role
  const adminUsers = filteredUsers.filter(user => user.role === 'admin');
  const editorUsers = filteredUsers.filter(user => user.role === 'editor');
  const viewerUsers = filteredUsers.filter(user => user.role === 'viewer');
  
  // Format date to a more readable format
  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    // Convert string date to Date object if needed
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };
  
  // Handle user creation
  const handleCreateUser = (userData: any) => {
    createUserMutation.mutate(userData);
  };
  
  // Handle user deletion with confirmation
  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };
  
  // Handle toggling user active status
  const toggleUserStatus = (userId: number, currentStatus: boolean) => {
    updateUserStatusMutation.mutate({ 
      userId, 
      isActive: !currentStatus 
    });
  };
  
  // Render role badge with appropriate color and icon
  const RoleBadge = ({ role }: { role: 'admin' | 'editor' | 'viewer' }) => {
    switch(role) {
      case 'admin':
        return (
          <Badge className="bg-purple-600 text-white flex items-center gap-1">
            <ShieldAlertIcon className="h-3 w-3" />
            Admin
          </Badge>
        );
      case 'editor':
        return (
          <Badge className="bg-blue-600 text-white flex items-center gap-1">
            <PenIcon className="h-3 w-3" />
            Editor
          </Badge>
        );
      case 'viewer':
        return (
          <Badge className="bg-green-600 text-white flex items-center gap-1">
            <EyeIcon className="h-3 w-3" />
            Viewer
          </Badge>
        );
    }
  };
  
  // Render user status badge
  const StatusBadge = ({ isActive }: { isActive: boolean }) => {
    return isActive ? (
      <Badge className="bg-green-600/20 text-green-600">Active</Badge>
    ) : (
      <Badge className="bg-gray-600/20 text-gray-600">Inactive</Badge>
    );
  };
  
  // Render user table section
  const UserTable = ({ users, title }: { users: User[], title: string }) => {
    if (users.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[250px]">User</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-medium">{user.fullName || user.username}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.department || 'Not assigned'}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto" 
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      disabled={updateUserStatusMutation.isPending}
                    >
                      <StatusBadge isActive={user.isActive} />
                    </Button>
                  </TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Edit user"
                      >
                        <PenIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deleteUserMutation.isPending}
                        title="Delete user"
                      >
                        {deleteUserMutation.isPending ? (
                          <LoaderIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">User Management</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => refetch()} 
            disabled={isLoading}
            className="flex items-center"
          >
            {isLoading ? (
              <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusIcon className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <CreateUserForm onSubmit={handleCreateUser} onCancel={() => setOpenDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex items-center rounded-md border px-3">
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Input
          placeholder="Search users by name, email, or department..."
          className="border-0 focus-visible:ring-0 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <LoaderIcon className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-64">
          <div className="bg-destructive/10 p-6 rounded-lg text-center max-w-md">
            <p className="text-destructive font-medium mb-2">Failed to load users</p>
            <p className="text-muted-foreground mb-4">
              There was an error loading user data. Please try again or contact support if the problem persists.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4 mr-2" /> Try Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          {filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center max-w-md">
                <p className="font-medium mb-2">No users found</p>
                <p className="text-muted-foreground mb-4">
                  {filter ? "Try adjusting your search query." : "Add a new user to get started."}
                </p>
                {filter && (
                  <Button variant="outline" onClick={() => setFilter("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <UserTable users={adminUsers} title="Administrators" />
              <UserTable users={editorUsers} title="Editors" />
              <UserTable users={viewerUsers} title="Viewers" />
            </>
          )}
        </div>
      )}
    </div>
  );
}