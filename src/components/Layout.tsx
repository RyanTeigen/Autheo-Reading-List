import { Link, Outlet } from "react-router"
import { Button } from "@/components/ui/button"

export function Layout() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Autheo Reading List
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/">Browse</Link>
            </Button>
            <Button asChild>
              <Link to="/contribute">Contribute</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-muted-foreground">
          An open knowledge base of resources that shaped the Autheo team's journey in tech.{" "}
          <a
            href="https://github.com/RyanTeigen/Autheo-Reading-List"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
