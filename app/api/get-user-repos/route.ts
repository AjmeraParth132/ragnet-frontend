import { NextResponse } from "next/server"

// This is a mock implementation - in a real app, you would fetch
// repositories from your database
export async function GET() {
  // Mock data for demonstration
  const repositories = [
    {
      id: "1",
      name: "API Documentation",
      dateAdded: "Jun 15, 2023",
      url: "https://github.com/user/api-docs",
    },
    {
      id: "2",
      name: "User Authentication Flow",
      dateAdded: "Jun 14, 2023",
      url: "https://github.com/user/auth-flow",
    },
    {
      id: "3",
      name: "Payment Integration",
      dateAdded: "Mar 4, 2024",
      url: "https://github.com/user/payment-integration",
    },
    {
      id: "4",
      name: "Frontend Components",
      dateAdded: "Apr 12, 2024",
      url: "https://github.com/user/frontend-components",
    },
    {
      id: "5",
      name: "Database Schema",
      dateAdded: "Jun 29, 2023",
      url: "https://github.com/user/db-schema",
    },
  ]

  return NextResponse.json(repositories)
}
