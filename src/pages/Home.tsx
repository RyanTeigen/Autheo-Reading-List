import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { CategoryCard } from "@/components/CategoryCard"
import { ResourceCard } from "@/components/ResourceCard"
import { categories, searchResources } from "@/lib/content"

export function Home() {
  const [query, setQuery] = useState("")

  const results = useMemo(() => (query.trim() ? searchResources(query) : null), [query])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Autheo Reading List</h1>
        <p className="text-muted-foreground">
          Books, articles, and papers recommended by the Autheo team, organized by topic.
        </p>
      </div>

      <Input
        placeholder="Search by title, author, or summary…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />

      {results ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            {results.length} result{results.length === 1 ? "" : "s"} for "{query}"
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((r) => (
              <ResourceCard key={`${r.categorySlug}-${r.url}`} resource={r} categoryName={r.categoryName} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}
