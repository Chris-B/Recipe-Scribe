import { useState } from "react"
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import { Logo } from "@/components/logo"
import { authClient } from "@/features/auth/lib/auth-client"
import { Route } from "@/routes/auth/resetpassword"

import { useForm } from '@tanstack/react-form'
import { authResetPasswordSchema } from '@/features/auth/schemas/auth-form-schemas'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

export default function ResetPasswordPage() {

  const navigate = useNavigate()
  const { error: tokenError, token } = Route.useSearch()
    
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: authResetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setErrorMessage(null);

        const { error } = await authClient.resetPassword({ newPassword: value.password, token: token ?? "" })

      if (error) {
        setErrorMessage(error.message ?? "Failed to reset password")
        return
      }

      setIsSuccess(true)

      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to reset password");
      }
    },
  });

  if (tokenError) {
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
          <form 
            id="reset-password-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}>
            <FieldGroup className="gap-4">
              <div className="relative">
                <form.Field name="password" children={(field) => { 
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <div className="relative">
                      <Input 
                        id={field.name} 
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        className="absolute right-1 top-0 h-full text-muted-foreground hover:bg-transparent cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        variant="ghost"
                        size="icon"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors}/>
                    )}
                  </Field>
                  )
                }}
                />
              </div>
              <div className="relative">
                <form.Field name="confirmPassword" children={(field) => { 
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                    <div className="relative">
                      <Input 
                        id={field.name} 
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Confirm your new password"
                      />
                      <Button
                        type="button"
                        className="absolute right-1 top-0 h-full text-muted-foreground hover:bg-transparent cursor-pointer"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        variant="ghost"
                        size="icon"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors}/>
                    )}
                  </Field>
                  )
                }}
                />
              </div>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Field orientation="horizontal">
                <Button type="submit" form="reset-password-form" className="w-full cursor-pointer mt-2" disabled={isSubmitting || !canSubmit}>
                  {isSubmitting ? "Resetting..." : "Reset password"}
                </Button>
              </Field>
            )}
          />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/auth/signin" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>

      <Link to="/" className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
        Back to home
      </Link>
    </div>
  )
}
