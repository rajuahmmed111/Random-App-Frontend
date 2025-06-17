"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import type { UserType } from "@/src/lib/types"
import { useToast } from "../hooks/use-toast"
import { authAPI } from "../lib/api"

interface AuthFormProps {
  onLogin: (user: UserType) => void
  onSignup: (user: UserType) => void
}

export function AuthForm({ onLogin, onSignup }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        if (!email || !password) {
          toast({
            title: "Validation Error",
            description: "Please fill in all fields",
            variant: "destructive",
          })
          return
        }

        const userData = await authAPI.login(email, password)
        onLogin(userData)
      } else {
        if (!email || !password || !username) {
          toast({
            title: "Validation Error",
            description: "Please fill in all fields",
            variant: "destructive",
          })
          return
        }

        const userData = await authAPI.register(email, username, password)
        onSignup(userData)
      }

      // Reset form
      setEmail("")
      setPassword("")
      setUsername("")
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
        <CardDescription>
          {isLogin ? "Welcome back to the roadmap platform" : "Create your account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full"
            disabled={loading}
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

