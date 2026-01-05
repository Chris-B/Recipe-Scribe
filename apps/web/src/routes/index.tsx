import { Link, createFileRoute } from "@tanstack/react-router"
import { ArrowRight, Sparkles, BookOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FeaturedRecipeCard } from "@/features/scribe/components/featured-recipe-card"

export const Route = createFileRoute("/")({
  component: Home,
});

const featuredRecipes = [
  {
    title: "Honey Garlic Chicken",
    description: "A delicious and easy honey garlic chicken dish that's perfect for weeknight dinners.",
    image: "/honey-garlic-chicken-dish.png",
    time: "35 min",
    servings: 4,
    tags: ["Asian", "Easy"],
  },
  {
    title: "Classic Margherita Pizza",
    description: "Authentic Italian pizza with fresh mozzarella, basil, and homemade tomato sauce.",
    image: "/margherita-pizza-fresh-basil.png",
    time: "45 min",
    servings: 4,
    tags: ["Italian", "Vegetarian"],
  },
  {
    title: "Creamy Mushroom Risotto",
    description: "Rich and creamy arborio rice cooked with porcini mushrooms and parmesan cheese.",
    image: "/creamy-mushroom-risotto.png",
    time: "40 min",
    servings: 4,
    tags: ["Italian", "Comfort"],
  },
]

function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Transform Your Kitchen Notes Into
                <span className="text-primary block mt-2">Beautiful Recipes</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
                Paste your handwritten notes, voice memos, or scattered ideas. Our AI-powered Recipe Scribe transforms
                them into perfectly structured, easy-to-follow recipes.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/recipes/scribe">
                    Start Creating
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#about">Learn More</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center p-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 font-serif text-xl text-foreground">AI-Powered</h3>
                <p className="mt-3 text-muted-foreground">
                  Our smart AI understands your notes and extracts ingredients, steps, and timing automatically.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 font-serif text-xl text-foreground">Beautifully Formatted</h3>
                <p className="mt-3 text-muted-foreground">
                  Get professional-quality recipe cards ready to save, share, or print with your friends.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 font-serif text-xl text-foreground">Save Time</h3>
                <p className="mt-3 text-muted-foreground">
                  No more typing out recipes manually. Transform your notes in seconds, not hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Recipes Section */}
        <section id="featured" className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">Featured Recipes</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore recipes created by our community using Recipe Scribe
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredRecipes.map((recipe) => (
                <FeaturedRecipeCard key={recipe.title} {...recipe} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="cursor-pointer">
                View All Recipes
              </Button>
            </div>
          </div>
        </section>

        {/* About / CTA Section */}
        <section id="about" className="py-16 lg:py-24 bg-accent/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
                  Your Kitchen Companion
                </h2>
                <p className="mt-6 text-lg text-muted-foreground">
                  Recipe Scribe was born from the frustration of trying to recreate grandma's recipes from cryptic
                  handwritten notes and faded index cards.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Our AI understands the informal language of kitchen notes—the dashes, the abbreviations, the "cook
                  until it looks right" instructions—and transforms them into clear, structured recipes anyone can
                  follow.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                      1
                    </span>
                    <span className="text-foreground">Paste your notes, no matter how messy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                      2
                    </span>
                    <span className="text-foreground">Answer a few clarifying questions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                      3
                    </span>
                    <span className="text-foreground">Get a beautiful, shareable recipe</span>
                  </li>
                </ul>
                <div className="mt-10">
                  <Button size="lg" asChild>
                    <Link to="/recipes/scribe">
                      Try Recipe Scribe
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="/cozy-kitchen-with-recipe-cards-and-ingredients.png"
                    alt="Cozy kitchen workspace"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
