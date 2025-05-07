import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define user permission options
const permissions = {
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
  VIEW_DEALS: 'view_deals',
  MANAGE_DEALS: 'manage_deals',
  VIEW_ANALYTICS: 'view_analytics',
};

// Predefined permission groups with their default permissions
const defaultPermissionGroups = [
  {
    name: 'Admin',
    description: 'Full system access with all permissions',
    permissions: Object.values(permissions),
    is_default: false,
  },
  {
    name: 'Internal',
    description: 'Internal users with access to most features',
    permissions: ['view_users', 'view_deals', 'manage_deals', 'view_analytics'],
    is_default: true,
  },
  {
    name: 'External',
    description: 'External users with limited access',
    permissions: ['view_deals', 'view_analytics'],
    is_default: false,
  },
];

// Permission group interface
interface PermissionGroup {
  id: number;
  name: string;
  description?: string;
  permissions: string[];
  is_default: boolean;
  created_at: string;
}

// User interface
interface User {
  id: number;
  username: string;
  display_name?: string;
  oauth_provider?: string;
  is_admin: boolean;
  permissions: string[];
  permission_groups?: number[];
  created_at: string;
  last_login?: string;
}

export default function UserManagement() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [isInviting, setIsInviting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    password: '',
    is_admin: false,
    permission_group_id: 0,
    permissions: [] as string[],
  });
  
  // Invite form state
  const [inviteData, setInviteData] = useState({
    email: '',
    is_admin: false,
    permission_group_id: 0,
    permissions: [] as string[],
  });

  // Fetch users and permission groups when component mounts
  useEffect(() => {
    fetchUsers();
    fetchPermissionGroups();
  }, []);

  // If not admin, redirect to home
  useEffect(() => {
    if (user && !user.is_admin) {
      setLocation("/");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [user, setLocation, toast]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You must be logged in to access users');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to access users');
        } else {
          throw new Error('Failed to fetch users');
        }
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissionGroups = async () => {
    try {
      const response = await fetch('/api/permission-groups', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You must be logged in to access permission groups');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to access permission groups');
        } else {
          throw new Error('Failed to fetch permission groups');
        }
      }
      
      const data = await response.json();
      
      // If no permission groups exist, create the default ones
      if (data.length === 0) {
        for (const group of defaultPermissionGroups) {
          await fetch('/api/permission-groups', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(group),
          });
        }
        // Fetch again to get the created groups
        const newResponse = await fetch('/api/permission-groups', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const newData = await newResponse.json();
        setPermissionGroups(newData);
      } else {
        setPermissionGroups(data);
      }
    } catch (err: any) {
      console.error('Error fetching permission groups:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to fetch permission groups',
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    
    // Find user's permission group
    let permissionGroupId = 0;
    if (user.permission_groups && user.permission_groups.length > 0) {
      permissionGroupId = user.permission_groups[0];
    }
    
    setFormData({
      username: user.username,
      display_name: user.display_name || '',
      password: '',
      is_admin: user.is_admin,
      permission_group_id: permissionGroupId,
      permissions: user.permissions || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePermissionGroupChange = (groupId: string) => {
    const id = parseInt(groupId);
    setFormData(prev => ({
      ...prev,
      permission_group_id: id,
      // Optionally update permissions to match the group's permissions
      permissions: permissionGroups.find(g => g.id === id)?.permissions || prev.permissions,
    }));
  };

  const handleInviteFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setInviteData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleInvitePermissionGroupChange = (groupId: string) => {
    const id = parseInt(groupId);
    setInviteData(prev => ({
      ...prev,
      permission_group_id: id,
      // Optionally update permissions to match the group's permissions
      permissions: permissionGroups.find(g => g.id === id)?.permissions || prev.permissions,
    }));
  };

  const saveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          permission_group_id: formData.permission_group_id || null,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      
      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setIsEditDialogOpen(false);
      
      toast({
        title: "User Updated",
        description: `User ${updatedUser.username} was updated successfully.`,
      });
    } catch (err: any) {
      console.error('Error updating user:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to update user',
        variant: "destructive",
      });
    }
  };

  const deleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "User Deleted",
        description: `User ${selectedUser.username} was deleted successfully.`,
      });
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to delete user',
        variant: "destructive",
      });
    }
  };

  const inviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    
    try {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...inviteData,
          permission_group_id: inviteData.permission_group_id || null,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to invite user');
      }
      
      const data = await response.json();
      setIsInviteDialogOpen(false);
      
      // Reset invite form
      setInviteData({
        email: '',
        is_admin: false,
        permission_group_id: 0,
        permissions: [],
      });
      
      // Refresh user list
      fetchUsers();
      
      toast({
        title: "User Invited",
        description: `Invitation sent to ${data.user.username}.`,
      });
    } catch (err: any) {
      console.error('Error inviting user:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to invite user',
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Get user initials for avatar
  const getUserInitials = (user: User) => {
    if (user.display_name) {
      return user.display_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  // Get permission group name for a user
  const getUserPermissionGroup = (user: User) => {
    if (!user.permission_groups || user.permission_groups.length === 0) {
      return 'None';
    }
    
    const groupId = user.permission_groups[0];
    const group = permissionGroups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown';
  };

  const handleEditGroup = (group: PermissionGroup) => {
    setSelectedGroup(group);
    setFormData({
      username: '',
      display_name: '',
      password: '',
      is_admin: false,
      permission_group_id: group.id,
      permissions: group.permissions || [],
    });
    setIsGroupDialogOpen(true);
  };

  const handleDeleteGroup = (group: PermissionGroup) => {
    setSelectedGroup(group);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setFormData({
      username: '',
      display_name: '',
      password: '',
      is_admin: false,
      permission_group_id: 0,
      permissions: [],
    });
    setIsGroupDialogOpen(true);
  };

  const handleSaveGroup = async () => {
    try {
      if (selectedGroup) {
        // Update existing group
        const response = await fetch(`/api/permission-groups/${selectedGroup.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.display_name,
            description: formData.username,
            permissions: formData.permissions,
            is_default: formData.is_admin,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update permission group');
        }

        toast({
          title: "Success",
          description: "Permission group updated successfully",
        });
      } else {
        // Create new group
        const response = await fetch('/api/permission-groups', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.display_name,
            description: formData.username,
            permissions: formData.permissions,
            is_default: formData.is_admin,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create permission group');
        }

        toast({
          title: "Success",
          description: "Permission group created successfully",
        });
      }

      setIsGroupDialogOpen(false);
      fetchPermissionGroups();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'An error occurred',
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroupConfirm = async () => {
    if (!selectedGroup) return;

    try {
      const response = await fetch(`/api/permission-groups/${selectedGroup.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete permission group');
      }

      toast({
        title: "Success",
        description: "Permission group deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      fetchPermissionGroups();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'An error occurred',
        variant: "destructive",
      });
    }
  };

  if (!user || !user.is_admin) {
    return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setLocation("/")}
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        {activeTab === "users" && (
          <Button 
            onClick={() => setIsInviteDialogOpen(true)} 
            className="bg-primary text-white hover:bg-primary/90"
            disabled={isInviting}
          >
            {isInviting ? "Sending Invite..." : "Invite User"}
          </Button>
        )}
        {activeTab === "groups" && (
          <Button onClick={handleCreateGroup} className="bg-primary text-white hover:bg-primary/90">
            Create Group
          </Button>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="groups">Permission Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage your organization's users and their permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Permission Group</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.display_name || user.username}</div>
                              <div className="text-sm text-muted-foreground">{user.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {user.is_admin ? (
                              <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground shadow-sm">
                                User
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-accent/20 px-2.5 py-1 text-xs font-medium">
                            {getUserPermissionGroup(user)}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>{formatDate(user.last_login)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteUser(user)}
                              disabled={user.id === (window as any).user?.id}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Permission Groups</CardTitle>
              <CardDescription>
                Configure access levels for different user types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionGroups.map(group => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">{group.name}</TableCell>
                        <TableCell>{group.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {group.permissions.map(permission => (
                              <span
                                key={permission}
                                className="inline-flex items-center rounded-full bg-accent/20 px-2.5 py-1 text-xs font-medium"
                              >
                                {permission.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {group.is_default ? (
                            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                              No
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditGroup(group)}
                            >
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={saveUser}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  placeholder="user@example.com"
                  required
                  className="border-input bg-background !text-white"
                  style={{ 
                    color: 'white', 
                    caretColor: 'white' 
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleFormChange}
                  placeholder="John Doe"
                  className="border-input bg-background !text-white"
                  style={{ 
                    color: 'white', 
                    caretColor: 'white' 
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="••••••••"
                  className="border-input bg-background !text-white"
                  style={{ 
                    color: 'white', 
                    caretColor: 'white' 
                  }}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_admin"
                  name="is_admin"
                  checked={formData.is_admin}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_admin: checked }))
                  }
                />
                <Label htmlFor="is_admin">Admin Access</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="permission_group_id">Permission Group</Label>
                <Select
                  value={formData.permission_group_id.toString()}
                  onValueChange={handlePermissionGroupChange}
                >
                  <SelectTrigger className="w-full bg-background !text-white border-input">
                    <SelectValue placeholder="Select a permission group" className="!text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-background !text-white">
                    <SelectItem value="0" className="!text-white">None</SelectItem>
                    {permissionGroups.map(group => (
                      <SelectItem key={group.id} value={group.id.toString()} className="!text-white">
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground mt-1">
                  Permission group grants specific access permissions to the user.
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Invite User Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation email to add a new user.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={inviteUser}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={inviteData.email}
                  onChange={handleInviteFormChange}
                  placeholder="user@example.com"
                  required
                  className="border-input bg-background text-white"
                  style={{ color: 'white' }}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="invite_is_admin"
                  name="is_admin"
                  checked={inviteData.is_admin}
                  onCheckedChange={(checked) => 
                    setInviteData(prev => ({ ...prev, is_admin: checked }))
                  }
                />
                <Label htmlFor="invite_is_admin">Admin Access</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invite_permission_group_id">Permission Group</Label>
                <Select
                  value={inviteData.permission_group_id.toString()}
                  onValueChange={handleInvitePermissionGroupChange}
                >
                  <SelectTrigger className="w-full bg-background text-white border-input">
                    <SelectValue placeholder="Select a permission group" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-white">
                    <SelectItem value="0" className="text-white">None</SelectItem>
                    {permissionGroups.map(group => (
                      <SelectItem key={group.id} value={group.id.toString()} className="text-white">
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground mt-1">
                  Permission group grants specific access permissions to the user.
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)} disabled={isInviting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={isInviting}>
                {isInviting ? "Inviting..." : "Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Permission Group Dialog */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>
              {selectedGroup ? 'Edit Permission Group' : 'Create Permission Group'}
            </DialogTitle>
            <DialogDescription>
              {selectedGroup
                ? 'Update the permission group details and access levels.'
                : 'Create a new permission group with specific access levels.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="group_name">Name</Label>
              <Input
                id="group_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleFormChange}
                placeholder="Group name"
                required
                className="border-input bg-background text-white"
                style={{ color: 'white' }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group_description">Description</Label>
              <Input
                id="group_description"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                placeholder="Group description"
                className="border-input bg-background text-white"
                style={{ color: 'white' }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`permission_${key}`}
                      checked={formData.permissions.includes(value)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          permissions: checked
                            ? [...prev.permissions, value]
                            : prev.permissions.filter(p => p !== value),
                        }));
                      }}
                    />
                    <Label htmlFor={`permission_${key}`} className="text-sm">
                      {key.replace(/_/g, ' ').toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_default"
                name="is_admin"
                checked={formData.is_admin}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, is_admin: checked }))
                }
              />
              <Label htmlFor="is_default">Set as default group</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGroup}>
              {selectedGroup ? 'Save Changes' : 'Create Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `Are you sure you want to delete the user "${selectedUser.username}"?`
                : `Are you sure you want to delete the permission group "${selectedGroup?.name}"?`}
              {selectedGroup && (
                <p className="mt-2 text-sm text-red-500">
                  Warning: This will remove all permission group assignments for users in this group.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={selectedUser ? deleteUser : handleDeleteGroupConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 