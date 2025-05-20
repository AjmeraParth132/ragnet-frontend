import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart2,
  PlusCircle,
  ChevronDown,
  Loader2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useOrganization } from "@/contexts/OrganizationContext";
import type { Organization } from "@/types";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <BarChart2 className="h-5 w-5" />,
    url: "/dashboard",
  },
  {
    label: "Sources",
    icon: <BarChart2 className="h-5 w-5" />,
    url: "/sources",
  },
  {
    label: "Outputs",
    icon: <BarChart2 className="h-5 w-5" />,
    url: "/outputs",
  },
  {
    label: "Playground",
    icon: <BarChart2 className="h-5 w-5" />,
    url: "/playground",
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { organizations, currentOrg, setCurrentOrg } = useOrganization();
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDescription, setNewOrgDescription] = useState("");
  const [isAddingOrg, setIsAddingOrg] = useState(false);

  const handleAddOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrgName) {
      setIsAddingOrg(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/organizations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              name: newOrgName,
              description: newOrgDescription,
            }),
          }
        );

        if (response.ok) {
          const newOrg = await response.json();
          setCurrentOrg(newOrg);
          setShowAddOrg(false);
          setNewOrgName("");
          setNewOrgDescription("");
        } else {
          const data = await response.json();
          alert(data.error || "Failed to create organization");
        }
      } catch (error) {
        console.error("Error creating organization:", error);
        alert("Failed to create organization. Please try again.");
      } finally {
        setIsAddingOrg(false);
      }
    }
  };

  const handleOrgChange = (org: Organization) => {
    setCurrentOrg(org);
  };

  return (
    <>
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-slate-900 flex items-center">
            <span className="text-indigo-500 mr-2">🧬</span>Ragnet
          </h1>
        </div>
        <nav className="flex-1 px-3 py-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.label}>
                <Button
                  variant={
                    window.location.pathname === item.url
                      ? "secondary"
                      : "ghost"
                  }
                  className={`w-full justify-start ${
                    window.location.pathname === item.url ? "bg-slate-100" : ""
                  }`}
                  onClick={() => navigate(item.url)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    {currentOrg?.name
                      ? currentOrg.name.charAt(0).toUpperCase()
                      : "🌐"}
                  </div>
                  <span className="text-sm text-slate-600 truncate">
                    {currentOrg?.name || "Select Organization"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[240px]">
              {organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrgChange(org)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{org.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}

              <DropdownMenuItem
                onClick={() => setShowAddOrg(true)}
                className="cursor-pointer border-t mt-1 pt-1"
              >
                <div className="flex items-center gap-2 text-indigo-600">
                  <PlusCircle className="h-4 w-4" />
                  <span>New Organization</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {currentOrg?.id && (
            <div className="mt-2 px-2 flex items-center gap-1 text-xs text-slate-500">
              <span className="truncate max-w-[180px]">{currentOrg.id}</span>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(currentOrg.id);
                  const copyIcon = document.getElementById("copy-icon");
                  if (copyIcon) {
                    copyIcon.innerHTML =
                      '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    setTimeout(() => {
                      copyIcon.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';
                    }, 3000);
                  }
                }}
                className="cursor-pointer hover:text-indigo-500"
              >
                <div id="copy-icon">
                  <Copy className="h-3 w-3" />
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
      {/* Add Organization Dialog */}
      <Dialog open={showAddOrg} onOpenChange={setShowAddOrg}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Add a new organization to manage your sources.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddOrg}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. My Company"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="orgDescription">Description (Optional)</Label>
                <Input
                  id="orgDescription"
                  value={newOrgDescription}
                  onChange={(e) => setNewOrgDescription(e.target.value)}
                  placeholder="Brief description of the organization"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddOrg(false)}
                disabled={isAddingOrg}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isAddingOrg}>
                {isAddingOrg ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Organization"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
