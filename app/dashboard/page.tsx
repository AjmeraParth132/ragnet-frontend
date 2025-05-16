"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface Repository {
  id: string
  name: string
  dateAdded: string
  url: string
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [newRepoUrl, setNewRepoUrl] = useState("")
  const [isIngestLoading, setIsIngestLoading] = useState(false)
  const [ingestError, setIngestError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchRepositories()
  }, [])

  const fetchRepositories = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/get-user-repos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRepositories(data)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to fetch repositories")
      }
    } catch (err) {
      setError("An error occurred while fetching repositories")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRepository = async () => {
    setIsIngestLoading(true)
    setIngestError("")

    try {
      // First create the repository
      const createResponse = await fetch("/api/repositories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: newRepoUrl,
        }),
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(errorData.message || "Failed to create repository")
      }

      const repoData = await createResponse.json()

      // Then ingest the data
      const ingestResponse = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoId: repoData.id,
          url: newRepoUrl,
        }),
      })

      if (!ingestResponse.ok) {
        const errorData = await ingestResponse.json()
        throw new Error(errorData.message || "Failed to ingest repository data")
      }

      // Refresh the repository list
      await fetchRepositories()
      setNewRepoUrl("")
      setIsDialogOpen(false)
    } catch (err: any) {
      setIngestError(err.message || "An error occurred")
    } finally {
      setIsIngestLoading(false)
    }
  }

  const handleRepoClick = (repoId: string) => {
    router.push(`/dashboard/repo/${repoId}`)
  }

  const handleIntegrateDiscord = async (repoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // This would typically open a dialog or redirect to Discord OAuth
    window.open(`/api/integrate-discord?repoId=${repoId}`, "_blank")
  }

  const filteredRepos = repositories.filter((repo) => repo.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Ragnet</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Repositories</h2>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="h-4 w-4 mr-2" /> Add Repository
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Repository</DialogTitle>
              </DialogHeader>
              {ingestError && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{ingestError}</div>}
              <div className="py-4">
                <label className="block text-sm font-medium mb-2">Repository URL</label>
                <Input
                  placeholder="https://github.com/username/repo"
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                />
                <p className="text-sm text-slate-500 mt-2">
                  Enter the URL of the repository you want to add. We'll ingest the documentation.
                </p>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddRepository}
                  disabled={isIngestLoading || !newRepoUrl}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  {isIngestLoading ? "Adding..." : "Add Repository"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search repositories"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Error state */}
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">{error}</div>}

        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-slate-500">Loading repositories...</p>
          </div>
        ) : (
          <>
            {/* Empty state */}
            {repositories.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium text-slate-700 mb-2">No repositories yet</h3>
                <p className="text-slate-500 mb-4">Add your first repository to get started</p>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-slate-900 hover:bg-slate-800">
                  <Plus className="h-4 w-4 mr-2" /> Add Repository
                </Button>
              </div>
            ) : (
              /* Repository list */
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Date Added</th>
                      <th className="w-32"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRepos.map((repo) => (
                      <tr
                        key={repo.id}
                        className="border-b hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleRepoClick(repo.id)}
                      >
                        <td className="py-3 px-4">{repo.name}</td>
                        <td className="py-3 px-4">{repo.dateAdded}</td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={(e) => handleIntegrateDiscord(repo.id, e)}
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Discord</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
