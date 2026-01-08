import { Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/features/auth/lib/auth-client'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { GoogleIcon } from "@/features/auth/components/google-icon"
import { Route } from '@/routes/auth/signin'

export function SignInPage() {
  
  const navigate = useNavigate()
  const { authRedirect } = Route.useSearch()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
  
      try {
        setErrorMessage(null)

        const { error } = await authClient.signIn.email({ email, password })

        if (error) {
          setErrorMessage(error.message ?? "Failed to sign in")
          return
        }

        await navigate({ to: authRedirect || "/" })

      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to sign in")
      } finally {
        setIsLoading(false)
      }
    }

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Logo className="mb-8"/>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Sign In */}
          <Button variant="outline" className="w-full bg-transparent cursor-pointer" onClick={handleGoogleSignIn} type="button">
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/auth/forgotpassword" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
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
            </div>

            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/auth/signup" search={{ authRedirect }} className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>

      <Link to="/" className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
        Back to home
      </Link>
    </div>
  )
}