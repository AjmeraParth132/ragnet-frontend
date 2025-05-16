export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Repository {
  id: string;
  name: string;
  org_name: string;
  repo_name: string;
  user_id: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function registerUser(
  email: string,
  password: string
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}

export async function createRepository(
  token: string,
  name: string,
  orgName: string,
  repoName: string
): Promise<Repository> {
  const response = await fetch(`${API_BASE_URL}/repositories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, orgName, repoName }),
  });

  if (!response.ok) {
    throw new Error("Failed to create repository");
  }

  return response.json();
}

export async function getUserRepositories(
  token: string
): Promise<Repository[]> {
  const response = await fetch(`${API_BASE_URL}/repositories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  return response.json();
}

export async function ingestRepository(
  token: string,
  repoId: string,
  branch: string = "main",
  subdir: string = "",
  fileFormat: string = "md"
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ repoId, branch, subdir, fileFormat }),
  });

  if (!response.ok) {
    throw new Error("Failed to ingest repository");
  }
}

export async function queryRepository(
  token: string,
  repoId: string,
  query: string
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ repoId, query }),
  });

  if (!response.ok) {
    throw new Error("Failed to query repository");
  }

  const data = await response.json();
  return data.response;
}
