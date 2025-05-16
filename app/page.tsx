"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        const data = await response.json()
        setError(data.message || "Login failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        const data = await response.json()
        setError(data.message || "Registration failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Marketing content from Ragnet.in */}
      <div className="w-1/2 bg-slate-100 p-16 flex flex-col justify-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-slate-800 mb-6">Unlock the power of your documentation</h1>

          <p className="text-slate-600 mb-6">
            Ragnet transforms your documentation into an intelligent knowledge base. Ask questions in natural language
            and get accurate answers instantly.
          </p>

          <div className="space-y-4 my-8">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 text-teal-500 mt-0.5">✓</div>
              <div>
                <h3 className="font-medium text-slate-800">Instant answers</h3>
                <p className="text-slate-600 text-sm">Get immediate responses to your questions about documentation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 text-teal-500 mt-0.5">✓</div>
              <div>
                <h3 className="font-medium text-slate-800">Easy integration</h3>
                <p className="text-slate-600 text-sm">Connect with Discord, Slack, or use our API</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 text-teal-500 mt-0.5">✓</div>
              <div>
                <h3 className="font-medium text-slate-800">Secure and private</h3>
                <p className="text-slate-600 text-sm">Your data remains private and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login/Register form */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Ragnet</h2>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>}
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Username"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
