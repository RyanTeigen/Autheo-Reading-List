import { Link } from "react-router"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Category } from "@/lib/parseCategory"

export function CategoryCard({ category }: { category: Category }) {
  const count = category.resources.length
  return (
    <Link to={`/category/${category.slug}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
          <CardDescription>
            {count === 0 ? "No resources yet" : `${count} resource${count === 1 ? "" : "s"}`}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
