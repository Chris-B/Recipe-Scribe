import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Logo } from "@/components/logo"
import { authClient } from "@/features/auth/lib/auth-client"

export function SiteHeader() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { data: session, isPending } = authClient.useSession()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await authClient.signOut()
      setMobileMenuOpen(false)
      await navigate({ to: "/" })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            activeOptions={{ includeHash: true }}
            activeProps={{ className: "text-md font-medium text-primary hover:text-primary transition-colors underline" }}
            inactiveProps={{ className: "text-md font-medium text-muted-foreground hover:text-primary transition-colors" }}
          >
            Home
          </Link>
          <Link
            to="/"
            hash="featured"
            activeOptions={{ includeHash: true }}
            activeProps={{ className: "text-md font-medium text-primary hover:text-primary transition-colors underline" }}
            inactiveProps={{ className: "text-md font-medium text-muted-foreground hover:text-primary transition-colors" }}
          >
            Featured
          </Link>
          <Link
            to="/"
            hash="about"
            activeOptions={{ includeHash: true }}
            activeProps={{ className: "text-md font-medium text-primary hover:text-primary transition-colors underline" }}
            inactiveProps={{ className: "text-md font-medium text-muted-foreground hover:text-primary transition-colors" }}
          >
            About
          </Link>
          <Link
            to="/recipes/scribe"
            activeProps={{ className: "text-md font-medium text-primary hover:text-primary transition-colors underline" }}
            inactiveProps={{ className: "text-md font-medium text-muted-foreground hover:text-primary transition-colors" }}
          >
            Recipe Scribe
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isPending ? null : session?.user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {session.user.name || session.user.email}
              </span>
              <Button variant="ghost" onClick={handleSignOut} disabled={isSigningOut} className="cursor-pointer">
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth/signin" search={{}}>Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden p-2 text-foreground cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              activeOptions={{ includeHash: true }}
              activeProps={{ className: "text-sm font-medium text-foreground hover:text-primary transition-colors underline" }}
              inactiveProps={{ className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/"
              hash="featured"
              activeOptions={{ includeHash: true }}
              activeProps={{ className: "text-sm font-medium text-foreground hover:text-primary transition-colors underline" }}
              inactiveProps={{ className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Featured
            </Link>
            <Link
              to="/"
              hash="about"
              activeOptions={{ includeHash: true }}
              activeProps={{ className: "text-sm font-medium text-foreground hover:text-primary transition-colors underline" }}
              inactiveProps={{ className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/recipes/scribe"
              activeProps={{ className: "text-sm font-medium text-foreground hover:text-primary transition-colors underline" }}
              inactiveProps={{ className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Recipe Scribe
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {isPending ? null : session?.user ? (
                <>
                  <div className="px-1">
                    <p className="text-sm font-medium text-foreground">{session.user.name || "Signed in"}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                  <Button variant="ghost" className="w-full justify-center cursor-pointer" onClick={handleSignOut} disabled={isSigningOut}>
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="w-full justify-center">
                    <Link to="/auth/signin" search={{}}>Sign In</Link>
                  </Button>
                  <Button asChild className="w-full justify-center">
                    <Link to="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}