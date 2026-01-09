import { useState } from "react"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Link } from "@tanstack/react-router"
import { authClient } from "@/features/auth/lib/auth-client"

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { authForgotPasswordSchema } from '@/features/auth/schemas/auth-form-schemas'
import { useForm } from '@tanstack/react-form'

export function ForgotPasswordPage() {

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm({
      defaultValues: {
        email: "",
      },
      validators: {
        onChange: authForgotPasswordSchema,
      },
      onSubmit: async ({ value }) => {
        try {
          setErrorMessage(null);
  
          const { error } = await authClient.requestPasswordReset({ email: value.email });
  
          if (error) {
            setErrorMessage(error.message ?? "Failed to request password reset");
            return;
          }
  
          setSubmittedEmail(value.email)
  
        } catch (err) {
          setErrorMessage(err instanceof Error ? err.message : "Failed to request password reset");
        }
      },
    });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <Logo className="mb-8" />

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">{submittedEmail ? "Check your email" : "Forgot password?"}</CardTitle>
          <CardDescription>
            {submittedEmail
              ? "We've sent a password reset link to your email address."
              : "No worries, we'll send you reset instructions."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submittedEmail ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                We sent a reset link to <span className="font-medium text-foreground">{form.state.values.email}</span>
              </p>
              <Button
                variant="outline"
                className="w-full bg-transparent cursor-pointer"
                onClick={() => {
                  setSubmittedEmail(null)
                  form.reset()
                }}
              >
                Try a different email
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Didn't receive the email?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-primary hover:underline font-medium cursor-pointer"
                  onClick={() => {
                    form.handleSubmit();
                  }}
                >
                  Click to resend
                </Button>
              </p>
            </div>
          ) : (
            <form 
              id="forgot-password-form"
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
              </FieldGroup>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.isSubmitted]}
            children={([canSubmit, isSubmitting, isSubmitted]) => (
              <Field orientation="horizontal">
                <Button type="submit" form="forgot-password-form" className="w-full cursor-pointer mt-2" disabled={isSubmitting || !canSubmit} hidden={isSubmitted}>
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </Button>
              </Field>
            )}
          />

          <Link
            to="/auth/signin"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>

      <Link to="/" className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
        Back to home
      </Link>
    </div>
  )
}
