import { useState } from "react"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Link } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import { authClient } from "@/features/auth/lib/auth-client"

export function ForgotPasswordPage() {

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [email, setEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            setErrorMessage(null)
    
            const { error } = await authClient.requestPasswordReset({ email })
    
            if (error) {
              setErrorMessage(error.message ?? "Failed to request password reset")
              return
            }
    
          } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "Failed to request password reset")
        } finally {
            setIsLoading(false)
            setIsSubmitted(true)
        }
    }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Logo className="mb-8" />

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">{isSubmitted ? "Check your email" : "Forgot password?"}</CardTitle>
          <CardDescription>
            {isSubmitted
              ? "We've sent a password reset link to your email address."
              : "No worries, we'll send you reset instructions."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                We sent a reset link to <span className="font-medium text-foreground">{email}</span>
              </p>
              <Button
                variant="outline"
                className="w-full bg-transparent cursor-pointer"
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail("")
                }}
              >
                Try a different email
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Didn't receive the email?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline font-medium cursor-pointer"
                  onClick={() => {
                    setIsLoading(true)
                    setTimeout(() => setIsLoading(false), 1500)
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Resending..." : "Click to resend"}
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
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

              {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}

          <Link
            to="/auth/signin"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </CardContent>
      </Card>

      <Link to="/" className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
        Back to home
      </Link>
    </div>
  )
}
