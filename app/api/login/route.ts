import { NextResponse } from "next/server";

// This is a mock implementation - in a real app, you would validate credentials
// against your database and set up proper session management
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      throw new Error("Authentication failed");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      token: data.token,
      user: {
        id: data.userId,
        email: email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
