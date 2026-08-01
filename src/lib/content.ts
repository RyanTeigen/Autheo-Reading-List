import { parseCategory, type Category, type Resource } from "./parseCategory"

const files = import.meta.glob("/categories/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

export const categories: Category[] = Object.entries(files)
  .map(([path, raw]) => parseCategory(path.split("/").pop()!, raw))
  .sort((a, b) => a.name.localeCompare(b.name))

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getAllResources(): (Resource & { categorySlug: string; categoryName: string })[] {
  return categories.flatMap((c) =>
    c.resources.map((r) => ({ ...r, categorySlug: c.slug, categoryName: c.name }))
  )
}

export function getAllTypes(): string[] {
  return Array.from(new Set(getAllResources().map((r) => r.type))).sort()
}

export function searchResources(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return getAllResources()
  return getAllResources().filter((r) =>
    [r.title, r.author, r.summary, r.categoryName].some((field) =>
      field.toLowerCase().includes(q)
    )
  )
}
