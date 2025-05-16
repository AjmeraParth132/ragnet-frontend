import { NextResponse } from "next/server"

// This is a mock implementation - in a real app, you would fetch
// repository details from your database
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Mock repository data
  const repositories = {
    "1": { id: "1", name: "API Documentation" },
    "2": { id: "2", name: "User Authentication Flow" },
    "3": { id: "3", name: "Payment Integration" },
    "4": { id: "4", name: "Frontend Components" },
    "5": { id: "5", name: "Database Schema" },
  }

  const repository = repositories[id as keyof typeof repositories]

  if (!repository) {
    return NextResponse.json({ message: "Repository not found" }, { status: 404 })
  }

  return NextResponse.json(repository)
}
