import type React from "react"

import { useState, useMemo } from "react"
import { Eye, EyeOff, Check, X, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import { Logo } from "@/components/logo"
import { authClient } from "@/features/auth/lib/auth-client"
import { Route } from "@/routes/auth/resetpassword"

export default function ResetPasswordPage() {
    const navigate = useNavigate()

    const { error, token } = Route.useSearch()
    
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const passwordRequirements = useMemo(() => {
    return [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "One uppercase letter", met: /[A-Z]/.test(password) },
      { label: "One lowercase letter", met: /[a-z]/.test(password) },
      { label: "One number", met: /[0-9]/.test(password) },
    ]
  }, [password])

  const allRequirementsMet = passwordRequirements.every((req) => req.met)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allRequirementsMet || !passwordsMatch) return

    setIsLoading(true)
    
    try {
      setErrorMessage(null)

      const { error } = await authClient.resetPassword({ newPassword: password, token: token ?? "" })

      if (error) {
        setErrorMessage(error.message ?? "Failed to reset password")
        return
      }

      setIsSuccess(true)

    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to reset password")
    } finally {
      setIsLoading(false)
    }

  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <Logo className="mb-8" />

        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="font-serif text-2xl">Password reset unsuccessful</CardTitle>
            <CardDescription>
              There was an error resetting your password. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full cursor-pointer" onClick={() => navigate({ to: "/auth/signin" })}>
              Continue to sign in
            </Button>
          </CardContent>
        </Card>

        <Link to="/" className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back to home
        </Link>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <Logo className="mb-8" />

        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="font-serif text-2xl">Password reset successful</CardTitle>
            <CardDescription>
              Your password has been successfully reset. You can now sign in with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full cursor-pointer" onClick={() => navigate({ to: "/auth/signin" })}>
              Continue to sign in
            </Button>
          </CardContent>
        </Card>

        <Link to="/" className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Logo className="mb-8" />

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Reset your password</CardTitle>
          <CardDescription>Enter a new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            {/* Password requirements */}
            {password.length > 0 && (
              <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">Password requirements:</p>
                <ul className="space-y-1">
                  {passwordRequirements.map((req) => (
                    <li key={req.label} className="flex items-center gap-2 text-xs">
                      {req.met ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className={req.met ? "text-green-600" : "text-muted-foreground"}>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="h-3 w-3" />
                  Passwords match
                </p>
              )}
            </div>

            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading || !allRequirementsMet || !passwordsMatch}>
              {isLoading ? "Resetting..." : "Reset password"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/auth/signin" className="text-primary hover:underline font-medium">
              Sign in
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
