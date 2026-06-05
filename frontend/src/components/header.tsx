import { Moon, Package, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Package className="h-5.5 w-5.5" />
          </div>
          <h1 className="text-xl font-bold">Store Manager</h1>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full shadow-xs hover:bg-muted"
          title="Toggle Dark Mode (Press 'D')"
        >
          {theme === "dark" ? (
            <Sun className="animate-spin-slow h-4.5 w-4.5 text-amber-500" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-blue-600" />
          )}
        </Button>
      </div>
    </header>
  )
}
