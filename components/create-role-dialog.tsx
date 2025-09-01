"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, DollarSign } from "lucide-react"

interface CreateRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateRole: (role: any) => void
}

const defaultPermissions = {
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
}

export function CreateRoleDialog({ open, onOpenChange, onCreateRole }: CreateRoleDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [permissions, setPermissions] = useState(defaultPermissions)

  const togglePermission = (category: string, permission: string) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: {
          ...prev[category][permission],
          enabled: !prev[category][permission].enabled,
        },
      },
    }))
  }

  const toggleAllPermissions = (category: string) => {
    const allEnabled = Object.values(permissions[category]).every((p) => p.enabled)
    setPermissions((prev) => ({
      ...prev,
      [category]: Object.fromEntries(
        Object.entries(prev[category]).map(([key, value]) => [key, { ...value, enabled: !allEnabled }]),
      ),
    }))
  }

  const handleCreate = () => {
    if (!name.trim()) return

    const newRole = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      description,
      userCount: 0,
      permissions,
    }

    onCreateRole(newRole)
    setName("")
    setDescription("")
    setPermissions(defaultPermissions)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>Define a new role with specific permissions for your organization.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                placeholder="e.g., Content Manager"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                placeholder="Brief description of the role"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Permissions</h3>

            {Object.entries(permissions).map(([category, categoryPermissions]) => {
              const allEnabled = Object.values(categoryPermissions).every((p) => p.enabled)

              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {category === "Administration" ? (
                        <Settings className="h-5 w-5" />
                      ) : (
                        <DollarSign className="h-5 w-5" />
                      )}
                      <h4 className="font-medium">{category}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">All Permissions</span>
                      <Switch checked={allEnabled} onCheckedChange={() => toggleAllPermissions(category)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(categoryPermissions).map(([permission, config]) => (
                      <div
                        key={permission}
                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{permission}</p>
                            <p className="text-xs text-muted-foreground">{config.description}</p>
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
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
