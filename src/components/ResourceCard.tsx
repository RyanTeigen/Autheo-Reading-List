import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Resource } from "@/lib/parseCategory"

export function ResourceCard({
  resource,
  categoryName,
}: {
  resource: Resource
  categoryName?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:underline"
          >
            {resource.title}
          </a>
        </CardTitle>
        <CardDescription>
          {resource.author}
          {categoryName ? ` · ${categoryName}` : ""}
        </CardDescription>
        <CardAction>
          <Badge variant="secondary">{resource.type}</Badge>
        </CardAction>
      </CardHeader>
      {resource.summary && (
        <CardContent className="text-sm text-muted-foreground">{resource.summary}</CardContent>
      )}
    </Card>
  )
}
