"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Shield,
  Mail,
  Plus,
  Edit,
  Trash2,
  Settings,
  FileText,
  Database,
  Eye,
  DollarSign,
  MoreHorizontal,
  UserX,
  RotateCcw,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CreateRoleDialog } from "./create-role-dialog"
import { EditRoleDialog } from "./edit-role-dialog"
import { SendInvitationDialog } from "./send-invitation-dialog"
import { PasswordResetDialog } from "./password-reset-dialog"

interface Role {
  id: string
  name: string
  description: string
  userCount: number
  permissions: {
    [category: string]: {
      [permission: string]: {
        enabled: boolean
        description: string
      }
    }
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "pending" | "inactive"
  avatar?: string
  packageCount: number
  customerId: string
  hub: string
}

interface Invitation {
  id: string
  email: string
  role: string
  status: "pending" | "accepted" | "expired"
  sentAt: string
  expiresAt: string
}

const mockRoles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Administrative access to most system functions",
    userCount: 1,
    permissions: {
      Administration: {
        "All permissions": { enabled: true, description: "All permissions" },
        invites: { enabled: true, description: "Send and manage invitations" },
        permissions: { enabled: true, description: "Manage permissions" },
        roles: { enabled: true, description: "Manage roles and permissions" },
        users: { enabled: true, description: "Manage user accounts and permissions" },
        backup: { enabled: true, description: "Manage system backups and data export" },
        logs: { enabled: true, description: "View system logs and audit trails" },
        Reports: { enabled: true, description: "Generate system reports and analytics" },
        settings: { enabled: true, description: "Access system settings and configuration" },
      },
      "Billing & Payments": {
        manage: { enabled: true, description: "Process payments and manage billing" },
        refunds: { enabled: true, description: "Process refunds and adjustments" },
      },
    },
  },
  {
    id: "manager",
    name: "Manager",
    description: "Management access with limited administrative functions",
    userCount: 0,
    permissions: {
      Administration: {
        "All permissions": { enabled: false, description: "All permissions" },
        invites: { enabled: true, description: "Send and manage invitations" },
        permissions: { enabled: false, description: "Manage permissions" },
        roles: { enabled: false, description: "Manage roles and permissions" },
        users: { enabled: true, description: "Manage user accounts and permissions" },
        backup: { enabled: false, description: "Manage system backups and data export" },
        logs: { enabled: true, description: "View system logs and audit trails" },
        Reports: { enabled: true, description: "Generate system reports and analytics" },
        settings: { enabled: false, description: "Access system settings and configuration" },
      },
      "Billing & Payments": {
        manage: { enabled: false, description: "Process payments and manage billing" },
        refunds: { enabled: false, description: "Process refunds and adjustments" },
      },
    },
  },
  {
    id: "member",
    name: "Member",
    description: "Basic user access with limited permissions",
    userCount: 33,
    permissions: {
      Administration: {
        "All permissions": { enabled: false, description: "All permissions" },
        invites: { enabled: false, description: "Send and manage invitations" },
        permissions: { enabled: false, description: "Manage permissions" },
        roles: { enabled: false, description: "Manage roles and permissions" },
        users: { enabled: false, description: "Manage user accounts and permissions" },
        backup: { enabled: false, description: "Manage system backups and data export" },
        logs: { enabled: false, description: "View system logs and audit trails" },
        Reports: { enabled: false, description: "Generate system reports and analytics" },
        settings: { enabled: false, description: "Access system settings and configuration" },
      },
      "Billing & Payments": {
        manage: { enabled: false, description: "Process payments and manage billing" },
        refunds: { enabled: false, description: "Process refunds and adjustments" },
      },
    },
  },
  {
    id: "staff",
    name: "Staff",
    description: "Staff access with operational permissions",
    userCount: 1,
    permissions: {
      Administration: {
        "All permissions": { enabled: false, description: "All permissions" },
        invites: { enabled: false, description: "Send and manage invitations" },
        permissions: { enabled: false, description: "Manage permissions" },
        roles: { enabled: false, description: "Manage roles and permissions" },
        users: { enabled: false, description: "Manage user accounts and permissions" },
        backup: { enabled: false, description: "Manage system backups and data export" },
        logs: { enabled: true, description: "View system logs and audit trails" },
        Reports: { enabled: true, description: "Generate system reports and analytics" },
        settings: { enabled: false, description: "Access system settings and configuration" },
      },
      "Billing & Payments": {
        manage: { enabled: true, description: "Process payments and manage billing" },
        refunds: { enabled: false, description: "Process refunds and adjustments" },
      },
    },
  },
  {
    id: "super-admin",
    name: "Super Admin",
    description: "Full system access with all permissions",
    userCount: 2,
    permissions: {
      Administration: {
        "All permissions": { enabled: true, description: "All permissions" },
        invites: { enabled: true, description: "Send and manage invitations" },
        permissions: { enabled: true, description: "Manage permissions" },
        roles: { enabled: true, description: "Manage roles and permissions" },
        users: { enabled: true, description: "Manage user accounts and permissions" },
        backup: { enabled: true, description: "Manage system backups and data export" },
        logs: { enabled: true, description: "View system logs and audit trails" },
        Reports: { enabled: true, description: "Generate system reports and analytics" },
        settings: { enabled: true, description: "Access system settings and configuration" },
      },
      "Billing & Payments": {
        manage: { enabled: true, description: "Process payments and manage billing" },
        refunds: { enabled: true, description: "Process refunds and adjustments" },
      },
    },
  },
]

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    packageCount: 12,
    customerId: "ZMREEL355",
    hub: "Boston",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Manager",
    status: "active",
    packageCount: 8,
    customerId: "ZMRPUG692",
    hub: "Chicago",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Member",
    status: "pending",
    packageCount: 3,
    customerId: "ZMREEL775",
    hub: "New York",
  },
  {
    id: "4",
    name: "Alice Wilson",
    email: "alice@example.com",
    role: "Staff",
    status: "active",
    packageCount: 15,
    customerId: "ZMRFOX441",
    hub: "Los Angeles",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Member",
    status: "inactive",
    packageCount: 0,
    customerId: "ZMRCAT889",
    hub: "Miami",
  },
]

const mockInvitations: Invitation[] = [
  {
    id: "1",
    email: "ok@meemhealth.com",
    role: "Super Admin",
    status: "pending",
    sentAt: "6/18/2025",
    expiresAt: "6/25/2025",
  },
  {
    id: "2",
    email: "charlie@example.com",
    role: "Member",
    status: "expired",
    sentAt: "2024-01-10",
    expiresAt: "2024-01-17",
  },
]

export function RBACDashboard() {
  const [activeTab, setActiveTab] = useState("roles")
  const [selectedRole, setSelectedRole] = useState<Role>(mockRoles[0])
  const [roleTab, setRoleTab] = useState("permissions")
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations)
  const [userSearch, setUserSearch] = useState("")
  const [roleSearch, setRoleSearch] = useState("")

  const [createRoleOpen, setCreateRoleOpen] = useState(false)
  const [editRoleOpen, setEditRoleOpen] = useState(false)
  const [sendInvitationOpen, setSendInvitationOpen] = useState(false)
  const [passwordResetOpen, setPasswordResetOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleCreateRole = (newRole: Role) => {
    setRoles([...roles, newRole])
  }

  const handleUpdateRole = (updatedRole: Role) => {
    setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)))
    setSelectedRole(updatedRole)
  }

  const handleSendInvitation = (newInvitation: Invitation) => {
    setInvitations([newInvitation, ...invitations])
  }

  const togglePermission = (category: string, permission: string) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === selectedRole.id
          ? {
              ...role,
              permissions: {
                ...role.permissions,
                [category]: {
                  ...role.permissions[category],
                  [permission]: {
                    ...role.permissions[category][permission],
                    enabled: !role.permissions[category][permission].enabled,
                  },
                },
              },
            }
          : role,
      ),
    )

    setSelectedRole((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category],
          [permission]: {
            ...prev.permissions[category][permission],
            enabled: !prev.permissions[category][permission].enabled,
          },
        },
      },
    }))
  }

  const toggleAllPermissions = (category: string) => {
    const allEnabled = Object.values(selectedRole.permissions[category]).every((p) => p.enabled)

    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === selectedRole.id
          ? {
              ...role,
              permissions: {
                ...role.permissions,
                [category]: Object.fromEntries(
                  Object.entries(role.permissions[category]).map(([key, value]) => [
                    key,
                    { ...value, enabled: !allEnabled },
                  ]),
                ),
              },
            }
          : role,
      ),
    )

    setSelectedRole((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: Object.fromEntries(
          Object.entries(prev.permissions[category]).map(([key, value]) => [key, { ...value, enabled: !allEnabled }]),
        ),
      },
    }))
  }

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "settings":
        return <Settings className="h-4 w-4" />
      case "Reports":
        return <FileText className="h-4 w-4" />
      case "backup":
        return <Database className="h-4 w-4" />
      case "logs":
        return <Eye className="h-4 w-4" />
      case "manage":
        return <DollarSign className="h-4 w-4" />
      case "refunds":
        return <DollarSign className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const handlePasswordReset = (user: User) => {
    setSelectedUser(user)
    setPasswordResetOpen(true)
  }

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearch.toLowerCase()),
  )

  const filteredRoles = roles.filter((role) => role.name.toLowerCase().includes(roleSearch.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-12 bg-transparent border-0 p-0 space-x-8">
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 px-0 py-3 bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:shadow-none"
              >
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="roles"
                className="flex items-center gap-2 px-0 py-3 bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:shadow-none"
              >
                <Shield className="h-4 w-4" />
                <span>Roles & Permissions</span>
              </TabsTrigger>
              <TabsTrigger
                value="invitations"
                className="flex items-center gap-2 px-0 py-3 bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:shadow-none"
              >
                <Mail className="h-4 w-4" />
                <span>Invitations</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Users</h1>
                <p className="text-muted-foreground">Manage user accounts and their roles</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <Card className="opacity-100 shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">All Users</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      className="max-w-sm pl-10"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">User</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Email</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Role</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Pkg Ct</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Relay ID </th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Hub</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Last Login</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{user.email}</td>
                          <td className="p-4">
                            <Badge variant="secondary" className="bg-muted text-muted-foreground">
                              {user.role.toLowerCase()}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  user.status === "active"
                                    ? "bg-green-500"
                                    : user.status === "pending"
                                      ? "bg-yellow-500"
                                      : "bg-gray-400",
                                )}
                              />
                              <span className="text-sm capitalize">{user.status}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {user.packageCount}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-sm text-gray-700">{user.customerId}</span>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              {user.hub}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">Never</td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Edit className="h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-2"
                                  onClick={() => handlePasswordReset(user)}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                                  <UserX className="h-4 w-4" />
                                  Deactivate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card className="shadow-none border border-gray-200">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Available Roles</h2>
                      <Button
                        size="sm"
                        className="bg-black hover:bg-gray-800 text-white"
                        onClick={() => setCreateRoleOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Role
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Select a role to view or edit its permissions</p>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search roles..."
                        className="h-10 pl-10 border-gray-300"
                        value={roleSearch}
                        onChange={(e) => setRoleSearch(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      {filteredRoles.map((role) => (
                        <div
                          key={role.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors",
                            selectedRole.id === role.id
                              ? "border-blue-200 bg-blue-50"
                              : "border-gray-200 bg-gray-50 hover:bg-gray-100",
                          )}
                          onClick={() => setSelectedRole(role)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full border-2 border-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{role.name}</p>
                              <p className="text-xs text-gray-500">{role.userCount} users</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-gray-400" />
                        <div>
                          <h1 className="text-xl font-semibold">{selectedRole.name}</h1>
                          <p className="text-sm text-gray-600">{selectedRole.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditRoleOpen(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Role
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-transparent"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <Tabs value={roleTab} onValueChange={setRoleTab}>
                      <TabsList className="bg-transparent border-0 p-0 h-auto">
                        <TabsTrigger
                          value="permissions"
                          className="px-0 py-2 mr-6 bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none data-[state=active]:shadow-none"
                        >
                          Permissions
                        </TabsTrigger>
                        <TabsTrigger
                          value="users"
                          className="px-0 py-2 bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none data-[state=active]:shadow-none"
                        >
                          Users ({selectedRole.userCount})
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="permissions" className="space-y-6 mt-6">
                        {Object.entries(selectedRole.permissions).map(([category, permissions]) => {
                          const allEnabled = Object.values(permissions).every((p) => p.enabled)

                          return (
                            <div key={category} className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {category === "Administration" ? (
                                    <Settings className="h-5 w-5 text-gray-600" />
                                  ) : (
                                    <DollarSign className="h-5 w-5 text-gray-600" />
                                  )}
                                  <h3 className="text-lg font-medium">{category}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">All Permissions</span>
                                  <Switch checked={allEnabled} onCheckedChange={() => toggleAllPermissions(category)} />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(permissions).map(([permission, config]) => (
                                  <div
                                    key={permission}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                                      <div>
                                        <p className="font-medium text-sm">{permission}</p>
                                        <p className="text-xs text-gray-500">{config.description}</p>
                                      </div>
                                    </div>
                                    <Switch
                                      checked={config.enabled}
                                      onCheckedChange={() => togglePermission(category, permission)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </TabsContent>

                      <TabsContent value="users" className="mt-6">
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            Users with the {selectedRole.name} role will appear here
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Invitations</h1>
                <p className="text-muted-foreground">Manage pending user invitations</p>
              </div>
              <Button className="bg-black hover:bg-gray-800 text-white" onClick={() => setSendInvitationOpen(true)}>
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>

            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pending Invitations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Email</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Role</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Sent</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Expires</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitations.map((invitation) => (
                        <tr key={invitation.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium">{invitation.email}</td>
                          <td className="p-4">{invitation.role}</td>
                          <td className="p-4">
                            <Badge
                              variant={invitation.status === "pending" ? "default" : "secondary"}
                              className={invitation.status === "pending" ? "bg-black text-white" : ""}
                            >
                              {invitation.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{invitation.sentAt}</td>
                          <td className="p-4 text-muted-foreground">{invitation.expiresAt}</td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Resend Invitation
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                                  <UserX className="h-4 w-4" />
                                  Cancel Invitation
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <CreateRoleDialog open={createRoleOpen} onOpenChange={setCreateRoleOpen} onCreateRole={handleCreateRole} />

      <EditRoleDialog
        open={editRoleOpen}
        onOpenChange={setEditRoleOpen}
        role={selectedRole}
        onUpdateRole={handleUpdateRole}
      />

      <SendInvitationDialog
        open={sendInvitationOpen}
        onOpenChange={setSendInvitationOpen}
        roles={roles}
        onSendInvitation={handleSendInvitation}
      />

      <PasswordResetDialog
        open={passwordResetOpen}
        onOpenChange={setPasswordResetOpen}
        userName={selectedUser?.name || ""}
      />
    </div>
  )
}
