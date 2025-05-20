import React, { useEffect, useState } from "react";
import { fetchOrganizationSources } from "../api";
import type { Source } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowUpRight } from "lucide-react";
import { useOrganization } from "@/contexts/OrganizationContext";
import { Sidebar } from "@/components/Sidebar";
const SourcesPage: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceType, setNewSourceType] = useState("github");
  const [showAddSource, setShowAddSource] = useState(false);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const { currentOrg } = useOrganization();

  useEffect(() => {
    const getSources = async () => {
      if (currentOrg) {
        try {
          const fetchedSources = await fetchOrganizationSources(currentOrg.id);
          setSources(fetchedSources);
        } catch (error) {
          console.error("Error fetching sources:", error);
        }
      }
    };
    getSources();
  }, [currentOrg]);

  const filteredSources = sources
    .filter(
      (source) =>
        source &&
        source.name &&
        source.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.last_sync_at && b.last_sync_at) {
        return (
          new Date(b.last_sync_at).getTime() -
          new Date(a.last_sync_at).getTime()
        );
      } else if (a.last_sync_at) return -1;
      else if (b.last_sync_at) return 1;
      else if (a.created_at && b.created_at) {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return 0;
    });

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingSource(true);

    if (newSourceType === "discord") {
      try {
        const response = await fetch(
          "http://localhost:3000/api/sources/discord/auth",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              orgId: currentOrg?.id,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          window.location.href = data.authUrl;
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to initiate Discord authentication");
        }
      } catch (error) {
        console.error("Error initiating Discord auth:", error);
        alert("Failed to connect to Discord. Please try again.");
      } finally {
        setIsAddingSource(false);
      }
      return;
    }

    if (
      newSourceName &&
      newSourceUrl &&
      currentOrg &&
      newSourceType === "github"
    ) {
      try {
        const response = await fetch(`http://localhost:3000/api/sources`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: newSourceName,
            type: "github",
            orgId: currentOrg.id,
            config: {
              github: {
                url: newSourceUrl,
              },
            },
          }),
        });

        if (response.ok) {
          const newSource = await response.json();
          const validatedSource = {
            ...newSource,
            name: newSource.name || newSourceName,
            type: newSource.type || "github",
            config: newSource.config || { github: { url: newSourceUrl } },
            created_at: newSource.created_at || new Date().toISOString(),
          };
          setSources((prevSources) => [...prevSources, validatedSource]);
          setShowAddSource(false);
          setNewSourceName("");
          setNewSourceUrl("");
          setNewSourceType("github");
        } else {
          const data = await response.json();
          alert(data.error || "Failed to add source");
        }
      } catch (error) {
        console.error("Error adding source:", error);
        alert("Failed to add source. Please try again.");
      } finally {
        setIsAddingSource(false);
      }
    } else {
      setIsAddingSource(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <CardTitle>Connected Sources</CardTitle>
                  <CardDescription>
                    Manage your connected data sources
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search sources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <Dialog open={showAddSource} onOpenChange={setShowAddSource}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Source
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>Add New Source</DialogTitle>
                      <DialogDescription>
                        Connect a new data source to your organization.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSource}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="sourceName">Source Name</Label>
                          <Input
                            id="sourceName"
                            value={newSourceName}
                            onChange={(e) => setNewSourceName(e.target.value)}
                            placeholder="e.g. My GitHub Repository"
                            required
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>Source Type</Label>
                          <RadioGroup
                            value={newSourceType}
                            onValueChange={setNewSourceType}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="github" id="github" />
                              <Label
                                htmlFor="github"
                                className="flex items-center"
                              >
                                <span className="mr-2">🤖</span> GitHub
                                Repository
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="discord" id="discord" />
                              <Label
                                htmlFor="discord"
                                className="flex items-center"
                              >
                                <span className="mr-2">💬</span> Discord Server
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {newSourceType === "github" && (
                          <div className="grid gap-2">
                            <Label htmlFor="url">GitHub Repository URL</Label>
                            <Input
                              id="url"
                              value={newSourceUrl}
                              onChange={(e) => setNewSourceUrl(e.target.value)}
                              placeholder="https://github.com/username/repo"
                              required
                            />
                            <p className="text-xs text-slate-500 mt-1">
                              Note: The repository must be public.
                            </p>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddSource(false)}
                          disabled={isAddingSource}
                        >
                          Cancel
                        </Button>
                        {newSourceType === "github" ? (
                          <Button type="submit" disabled={isAddingSource}>
                            {isAddingSource ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              "Add Source"
                            )}
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="flex items-center"
                            disabled={isAddingSource}
                          >
                            {isAddingSource ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                Connect with Discord
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        )}
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Last Synced</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSources.length > 0 ? (
                    filteredSources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">
                          {source.name}
                        </TableCell>
                        <TableCell className="capitalize">
                          {source.type}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {source.config.github?.url ||
                            source.config.discord?.guild_id}
                        </TableCell>
                        <TableCell>
                          {source.last_sync_at ? (
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {new Date(
                                  source.last_sync_at
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(
                                  source.last_sync_at
                                ).toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">
                              Never
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-slate-500"
                      >
                        No sources found. Click "Add Source" to connect a new
                        data source.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SourcesPage;
