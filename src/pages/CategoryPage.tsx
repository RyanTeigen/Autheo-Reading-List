import { useMemo, useState } from "react"
import { Link, Navigate, useParams } from "react-router"
import { Badge } from "@/components/ui/badge"
import { ResourceCard } from "@/components/ResourceCard"
import { getCategory } from "@/lib/content"

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = slug ? getCategory(slug) : undefined
  const [activeType, setActiveType] = useState<string | null>(null)

  const types = useMemo(
    () => Array.from(new Set(category?.resources.map((r) => r.type) ?? [])).sort(),
    [category]
  )

  if (!category) return <Navigate to="/" replace />

  const resources = activeType
    ? category.resources.filter((r) => r.type === activeType)
    : category.resources

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← All categories
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
      </div>

      {types.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activeType === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveType(null)}
          >
            All
          </Badge>
          {types.map((type) => (
            <Badge
              key={type}
              variant={activeType === type ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      )}

      {resources.length === 0 ? (
        <p className="text-muted-foreground">
          No resources here yet.{" "}
          <Link to="/contribute" className="underline underline-offset-4">
            Be the first to add one.
          </Link>
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {resources.map((r) => (
            <ResourceCard key={r.url} resource={r} />
          ))}
        </div>
      )}
    </div>
  )
}
