import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/features/auth/lib/auth-client"

import { Logo } from "@/components/logo"
import { GoogleIcon } from "@/features/auth/components/google-icon"
import { Route } from "@/routes/auth/signup"

export function SignUpPage() {

  const navigate = useNavigate()
  const { authRedirect } = Route.useSearch()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      setErrorMessage(null)

      const { error } = await authClient.signUp.email({ name, email, password })

      if (error) {
        setErrorMessage(error.message ?? "Failed to create account")
        return
      }

      await navigate({ to: authRedirect || "/" })

    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Logo className="mb-8"/>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Create an account</CardTitle>
          <CardDescription>Start transforming your recipes today</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Sign Up */}
          <Button variant="outline" className="w-full bg-transparent cursor-pointer" onClick={handleGoogleSignUp} type="button">
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or continue with email
            </span>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password Requirements */}
              {password && (
                <ul className="mt-3 space-y-1">
                  {passwordRequirements.map((req) => (
                    <li
                      key={req.label}
                      className={`flex items-center gap-2 text-xs ${
                        req.met ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      {req.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {req.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
            
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading || !passwordRequirements.every((r) => r.met)}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/signin" search={{ authRedirect }} className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground max-w-md">
        By creating an account, you agree to our{" "}
        <Link to="/" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <Link to="/" className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
        Back to home
      </Link>
    </div>
  )
}