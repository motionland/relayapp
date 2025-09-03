"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Shield,
  Key,
  Clock,
  Users,
  Globe,
  Download,
  Search,
  MoreHorizontal,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
} from "lucide-react"

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("policies")
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({})

  // Mock data for API keys
  const apiKeys = [
    {
      id: "1",
      name: "Production API",
      key: "sk_live_51H7qABC123456789...",
      status: "Active",
      lastUsed: "2024-01-15 14:30",
      created: "2024-01-01",
    },
    {
      id: "2",
      name: "Development API",
      key: "sk_test_51H7qDEF987654321...",
      status: "Active",
      lastUsed: "2024-01-14 09:15",
      created: "2024-01-05",
    },
    {
      id: "3",
      name: "Mobile App API",
      key: "sk_live_51H7qGHI456789123...",
      status: "Inactive",
      lastUsed: "2024-01-10 16:45",
      created: "2023-12-15",
    },
  ]

  // Mock data for access logs
  const accessLogs = [
    {
      id: "1",
      timestamp: "2024-01-15 14:30:25",
      user: "admin@metro.com",
      action: "Login Success",
      ip: "192.168.1.100",
      userAgent: "Chrome 120.0.0.0",
      status: "Success",
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:25:10",
      user: "user@metro.com",
      action: "Failed Login",
      ip: "192.168.1.105",
      userAgent: "Firefox 121.0.0.0",
      status: "Failed",
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:20:15",
      user: "admin@metro.com",
      action: "Settings Updated",
      ip: "192.168.1.100",
      userAgent: "Chrome 120.0.0.0",
      status: "Success",
    },
  ]

  // Mock data for audit logs
  const auditLogs = [
    {
      id: "1",
      timestamp: "2024-01-15 14:30:25",
      event: "User Created",
      user: "admin@metro.com",
      target: "john.doe@metro.com",
      details: "New user account created",
      type: "User Management",
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:25:10",
      event: "Password Policy Updated",
      user: "admin@metro.com",
      target: "System Settings",
      details: "Minimum password length changed to 12",
      type: "System",
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:20:15",
      event: "API Key Generated",
      user: "admin@metro.com",
      target: "Production API",
      details: "New API key created for production environment",
      type: "API",
    },
  ]

  const toggleApiKeyVisibility = (keyId: string) => {
    setShowApiKey((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">Security Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure security policies, authentication, and monitoring settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring & Logs</TabsTrigger>
        </TabsList>

        {/* Security Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          {/* Password Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Password Policy Configuration
              </CardTitle>
              <CardDescription>Set password requirements and complexity rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="minLength">Minimum Password Length</Label>
                    <Select defaultValue="8">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 characters</SelectItem>
                        <SelectItem value="8">8 characters</SelectItem>
                        <SelectItem value="10">10 characters</SelectItem>
                        <SelectItem value="12">12 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maxLength">Maximum Password Length</Label>
                    <Select defaultValue="128">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="64">64 characters</SelectItem>
                        <SelectItem value="128">128 characters</SelectItem>
                        <SelectItem value="256">256 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                    <Switch id="requireUppercase" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireLowercase">Require Lowercase Letters</Label>
                    <Switch id="requireLowercase" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers">Require Numbers</Label>
                    <Switch id="requireNumbers" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecial">Require Special Characters</Label>
                    <Switch id="requireSpecial" defaultChecked />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="passwordExpiry">Password Expiration</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">365 days</SelectItem>
                      <SelectItem value="never">Never expire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="passwordHistory">Password History</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No restriction</SelectItem>
                      <SelectItem value="3">Last 3 passwords</SelectItem>
                      <SelectItem value="5">Last 5 passwords</SelectItem>
                      <SelectItem value="10">Last 10 passwords</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Save Password Policy</Button>
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Session Management
              </CardTitle>
              <CardDescription>Configure session timeout and idle logout settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout</Label>
                  <Select defaultValue="24">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="168">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="idleTimeout">Idle Logout Duration</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="0">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="concurrentSessions">Allow Concurrent Sessions</Label>
                  <Switch id="concurrentSessions" defaultChecked />
                </div>
              </div>
              <Button>Save Session Settings</Button>
            </CardContent>
          </Card>

          {/* Login Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Login Security
              </CardTitle>
              <CardDescription>Configure login attempt limits and lockout policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="maxAttempts">Maximum Failed Login Attempts</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lockoutDuration">Account Lockout Duration</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                      <SelectItem value="manual">Manual unlock only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="resetWindow">Reset Attempt Counter After</Label>
                  <Select defaultValue="60">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="progressiveLockout">Progressive Lockout</Label>
                  <Switch id="progressiveLockout" />
                </div>
              </div>
              <Button>Save Login Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authentication Tab */}
        <TabsContent value="auth" className="space-y-6">
          {/* Multi-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Multi-Factor Authentication (MFA)
              </CardTitle>
              <CardDescription>Configure MFA requirements and methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mfaEnforcement">MFA Enforcement</Label>
                  <Select defaultValue="admin-only">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">Disabled</SelectItem>
                      <SelectItem value="optional">Optional for all users</SelectItem>
                      <SelectItem value="admin-only">Required for admins only</SelectItem>
                      <SelectItem value="all-users">Required for all users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Available MFA Methods</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="totpAuth">TOTP Authenticator Apps</Label>
                      <Switch id="totpAuth" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="smsAuth">SMS Authentication</Label>
                      <Switch id="smsAuth" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailAuth">Email Authentication</Label>
                      <Switch id="emailAuth" />
                    </div>
                  </div>
                </div>
              </div>
              <Button>Save MFA Settings</Button>
            </CardContent>
          </Card>

          {/* SSO Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Single Sign-On (SSO) Configuration
              </CardTitle>
              <CardDescription>Configure SAML and OpenID Connect providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ssoEnabled">Enable SSO</Label>
                  <Switch id="ssoEnabled" />
                </div>
                <div>
                  <Label htmlFor="ssoProvider">SSO Provider Type</Label>
                  <Select defaultValue="saml">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saml">SAML 2.0</SelectItem>
                      <SelectItem value="oidc">OpenID Connect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="metadataUrl">SAML Metadata URL</Label>
                  <Input id="metadataUrl" placeholder="https://your-idp.com/metadata.xml" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="oidcIssuer">OIDC Issuer</Label>
                    <Input id="oidcIssuer" placeholder="https://your-provider.com" />
                  </div>
                  <div>
                    <Label htmlFor="oidcClientId">Client ID</Label>
                    <Input id="oidcClientId" placeholder="your-client-id" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="oidcClientSecret">Client Secret</Label>
                  <Input id="oidcClientSecret" type="password" placeholder="your-client-secret" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button>Save SSO Configuration</Button>
                <Button variant="outline">Test Connection</Button>
              </div>
            </CardContent>
          </Card>

          {/* API Key Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key Management
              </CardTitle>
              <CardDescription>Generate and manage API keys for system access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Active API Keys</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage API keys for external integrations</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono">
                              {showApiKey[apiKey.id] ? apiKey.key : "••••••••••••••••••••"}
                            </code>
                            <Button variant="ghost" size="sm" onClick={() => toggleApiKeyVisibility(apiKey.id)}>
                              {showApiKey[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={apiKey.status === "Active" ? "default" : "secondary"}>{apiKey.status}</Badge>
                        </TableCell>
                        <TableCell>{apiKey.lastUsed}</TableCell>
                        <TableCell>{apiKey.created}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Regenerate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Revoke
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Control Tab */}
        <TabsContent value="access" className="space-y-6">
          {/* IP Access Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                IP Access Control
              </CardTitle>
              <CardDescription>Manage IP allowlist and blocklist for system access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ipRestrictions">Enable IP Restrictions</Label>
                  <Switch id="ipRestrictions" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="adminBypass">Allow Admin Bypass</Label>
                  <Switch id="adminBypass" defaultChecked />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="allowlist">IP Allowlist</Label>
                  <Textarea
                    id="allowlist"
                    placeholder="192.168.1.0/24&#10;10.0.0.1&#10;203.0.113.0/24"
                    className="h-32"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Enter IP addresses or CIDR blocks, one per line
                  </p>
                </div>
                <div>
                  <Label htmlFor="blocklist">IP Blocklist</Label>
                  <Textarea id="blocklist" placeholder="192.168.100.0/24&#10;203.0.113.50" className="h-32" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Enter IP addresses or CIDR blocks to block, one per line
                  </p>
                </div>
              </div>
              <Button>Save IP Access Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring & Logs Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          {/* Access Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Access Logs
              </CardTitle>
              <CardDescription>View and download user access logs and login attempts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Input placeholder="Search logs..." className="w-64" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>User Agent</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                        <TableCell className="max-w-48 truncate">{log.userAgent}</TableCell>
                        <TableCell>
                          <Badge variant={log.status === "Success" ? "default" : "destructive"}>{log.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Audit Trail
              </CardTitle>
              <CardDescription>System-wide activity logs and administrative actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Input placeholder="Search audit logs..." className="w-64" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="user">User Management</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Audit Log
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell className="font-medium">{log.event}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.target}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-64 truncate">{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
