import { ChefHat, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link } from "@tanstack/react-router"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-medium text-foreground">Recipe Scribe</h2>
            <p className="text-xs text-muted-foreground hidden sm:block">Notes to recipes, effortlessly</p>
          </div>
        </Link>

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
          <Button variant="ghost" asChild>
            <Link to="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/auth/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
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
              <Button variant="ghost" asChild className="w-full justify-center">
                <Link to="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild className="w-full justify-center">
                <Link to="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}