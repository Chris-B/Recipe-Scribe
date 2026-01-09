import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/features/auth/lib/auth-client"

import { Logo } from "@/components/logo"
import { GoogleIcon } from "@/features/auth/components/google-icon"
import { Route } from "@/routes/auth/signup"

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { authSignupSchema } from '@/features/auth/schemas/auth-form-schemas'
import { useForm } from '@tanstack/react-form'

export function SignUpPage() {

  const navigate = useNavigate()
  const { authRedirect } = Route.useSearch()

  const [showPassword, setShowPassword] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm({
      defaultValues: {
        name: "",
        email: "",
        password: "",
      },
      validators: {
        onChange: authSignupSchema,
      },
      onSubmit: async ({ value }) => {
        try {
          setErrorMessage(null);
  
          const { error } = await authClient.signUp.email({ name: value.name, email: value.email, password: value.password });
  
          if (error) {
            setErrorMessage(error.message ?? "Failed to create account");
            return;
          }
  
          await navigate({ to: authRedirect || "/" });
  
        } catch (err) {
          setErrorMessage(err instanceof Error ? err.message : "Failed to create account");
        }
      },
    });

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <Logo className="mb-8"/>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Create an account</CardTitle>
          <CardDescription>Start transforming your recipes today</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Sign Up */}
          <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignUp} type="button">
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
          <form 
            id="signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}>
            <FieldGroup className="gap-4">
              <form.Field name="name" children={(field) => { 
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input 
                    id={field.name} 
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="text" 
                    autoComplete="name"
                    placeholder="Enter your name"
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors}/>
                  )}
                </Field>
                )
              }}
              />
              <form.Field name="email" children={(field) => { 
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input 
                    id={field.name} 
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="email" 
                    autoComplete="email"
                    placeholder="Enter your email"
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors}/>
                  )}
                </Field>
                )
              }}
              />
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
                        placeholder="Enter a password"
                      />
                      <Button
                        type="button"
                        className="absolute right-1 top-0 h-full text-muted-foreground hover:bg-transparent"
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
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Field orientation="horizontal">
                <Button type="submit" form="signup-form" className="w-full mt-2" disabled={isSubmitting || !canSubmit}>
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </Field>
            )}
          />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/signin" search={{ authRedirect }} className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
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