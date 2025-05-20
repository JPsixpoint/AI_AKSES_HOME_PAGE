import React, { useState } from "react";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateUserForm } from "@/components/users/create-user-form";

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
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filter, setFilter] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  
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
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Handle user creation (mock)
  const handleCreateUser = (userData: any) => {
    // In a real app, you would send this to your API
    const newUser: User = {
      id: users.length + 1,
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      department: userData.department,
      isActive: true,
      createdAt: new Date()
    };
    
    setUsers([...users, newUser]);
    setOpenDialog(false);
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
                    <StatusBadge isActive={user.isActive} />
                  </TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <PenIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <TrashIcon className="h-4 w-4" />
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
      
      <div className="flex items-center rounded-md border px-3">
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Input
          placeholder="Search users by name, email, or department..."
          className="border-0 focus-visible:ring-0 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      
      <div className="mt-6">
        <UserTable users={adminUsers} title="Administrators" />
        <UserTable users={editorUsers} title="Editors" />
        <UserTable users={viewerUsers} title="Viewers" />
      </div>
    </div>
  );
}