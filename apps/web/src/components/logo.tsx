import { Link } from "@tanstack/react-router"
import { ChefHat } from "lucide-react"
 
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-3", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
        <ChefHat className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="font-serif text-2xl font-medium text-foreground">Recipe Scribe</span>
    </Link>
  )
}