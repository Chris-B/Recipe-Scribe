import { createFileRoute } from '@tanstack/react-router'
import ResetPasswordPage from '@/features/auth/pages/reset-password-page'
import { authResetSchema } from '@/features/auth/schemas/auth-search-schemas'

export const Route = createFileRoute('/auth/resetpassword')({
  component: ResetPasswordPage,
  validateSearch: authResetSchema
})
