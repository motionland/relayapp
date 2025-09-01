"use client"

import { useState, useEffect } from "react"
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

interface EditRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  onUpdateRole: (role: Role) => void
}

export function EditRoleDialog({ open, onOpenChange, role, onUpdateRole }: EditRoleDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [permissions, setPermissions] = useState<Role["permissions"]>({})

  useEffect(() => {
    if (role) {
      setName(role.name)
      setDescription(role.description)
      setPermissions(role.permissions)
    }
  }, [role])

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

  const handleUpdate = () => {
    if (!role || !name.trim()) return

    const updatedRole = {
      ...role,
      name,
      description,
      permissions,
    }

    onUpdateRole(updatedRole)
    onOpenChange(false)
  }

  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>Modify the role name, description, and permissions.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role-name">Role Name</Label>
              <Input id="edit-role-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role-description">Description</Label>
              <Input id="edit-role-description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
          <Button onClick={handleUpdate} disabled={!name.trim()}>
            Update Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
