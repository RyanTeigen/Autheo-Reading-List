export interface Resource {
  title: string
  url: string
  type: string
  author: string
  summary: string
}

export interface Category {
  slug: string
  name: string
  resources: Resource[]
}

const HEADING_RE = /^#\s+(.+)$/m
const ENTRY_RE = /^#{2,3}\s*\[([^\]]+)\]\s*\(([^)]+)\)/gm
const FIELD_RE = /\*\*(Type|Author|Summary):\*\*\s*(.+)/

export function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "")
}

export function parseCategory(filename: string, raw: string): Category {
  const slug = slugFromFilename(filename)
  const headingMatch = raw.match(HEADING_RE)
  const name = headingMatch ? headingMatch[1].trim() : slug

  const resources: Resource[] = []
  const entryStarts: { index: number; title: string; url: string }[] = []

  let match: RegExpExecArray | null
  ENTRY_RE.lastIndex = 0
  while ((match = ENTRY_RE.exec(raw)) !== null) {
    entryStarts.push({
      index: match.index + match[0].length,
      title: match[1].trim(),
      url: match[2].trim(),
    })
  }

  entryStarts.forEach((entry, i) => {
    const end = i + 1 < entryStarts.length ? entryStarts[i + 1].index : raw.length
    const block = raw.slice(entry.index, end)

    const fields: Record<string, string> = {}
    for (const line of block.split("\n")) {
      const fieldMatch = line.match(FIELD_RE)
      if (fieldMatch) fields[fieldMatch[1]] = fieldMatch[2].trim()
    }

    resources.push({
      title: entry.title,
      url: entry.url,
      type: fields.Type ?? "Resource",
      author: fields.Author ?? "Unknown",
      summary: fields.Summary ?? "",
    })
  })

  return { slug, name, resources }
}
