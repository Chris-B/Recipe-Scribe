import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { GoogleIcon } from "@/features/auth/components/google-icon"
import { authClient } from '@/features/auth/lib/auth-client'
import { Route } from '@/routes/auth/signin'
import { Link, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { authSigninSchema } from '@/features/auth/schemas/auth-form-schemas'
import { useForm } from '@tanstack/react-form'

export function SignInPage() {
  
  const navigate = useNavigate();
  const { authRedirect } = Route.useSearch();
  
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: authSigninSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setErrorMessage(null);

        const { error } = await authClient.signIn.email({ email: value.email, password: value.password });

        if (error) {
          setErrorMessage(error.message ?? "Failed to sign in");
          return;
        }

        await navigate({ to: authRedirect || "/" });

      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to sign in");
      }
    },
  });

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <Logo className="mb-8"/>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>

          {/* Google Sign In */}
          <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignIn} type="button">
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
          <form 
            id="signin-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}>
            <FieldGroup className="gap-4">
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
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Link to="/auth/forgotpassword" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input 
                        id={field.name} 
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
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
                <Button type="submit" form="signin-form" className="w-full mt-2" disabled={isSubmitting || !canSubmit}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </Field>
            )}
          />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/auth/signup" search={{ authRedirect }} className="text-primary hover:underline font-medium">
              Sign up
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