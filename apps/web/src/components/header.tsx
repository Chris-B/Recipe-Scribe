import { LogOut, Menu, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Logo } from "@/components/logo"
import { authClient } from "@/features/auth/lib/auth-client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors">
                    <AvatarImage src={session.user.image || "/avatar.png"} alt={session.user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {session.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/user/preferences">
                    <Settings className="mr-2 h-4 w-4" />
                    Preferences
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleSignOut} disabled={isSigningOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth/signin">Sign In</Link>
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
          className="md:hidden p-2 text-foreground"
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
                  <Button variant="ghost" className="w-full justify-center" onClick={handleSignOut} disabled={isSigningOut}>
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