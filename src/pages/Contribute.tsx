import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categories } from "@/lib/content"

const initialForm = {
  category: "",
  title: "",
  url: "",
  type: "",
  author: "",
  summary: "",
  // honeypot: real users never see or fill this field
  website: "",
}

export function Contribute() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [issueUrl, setIssueUrl] = useState<string | null>(null)

  function update<K extends keyof typeof initialForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): string | null {
    if (!form.category) return "Choose a category."
    if (!form.title.trim()) return "Title is required."
    try {
      new URL(form.url)
    } catch {
      return "Enter a valid URL, including https://."
    }
    if (!form.type.trim()) return "Type is required (e.g. Book, Article, Paper)."
    if (!form.author.trim()) return "Author is required."
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const error = validate()
    if (error) {
      toast.error(error)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error ?? "Something went wrong submitting your resource.")
      }

      setIssueUrl(data.issueUrl)
      setForm(initialForm)
      toast.success("Thanks! Your suggestion was submitted for review.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Contribute a resource</h1>
        <p className="text-muted-foreground">
          Suggest a book, article, or paper. Submissions open a GitHub issue for a maintainer to
          review before it's added to the list.
        </p>
      </div>

      {issueUrl && (
        <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm">
          Submitted!{" "}
          <a href={issueUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
            View the issue on GitHub
          </a>
          .
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Select value={form.category} onValueChange={(v) => update("category", v)}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Clean Code"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            value={form.url}
            onChange={(e) => update("url", e.target.value)}
            placeholder="https://…"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              placeholder="Book, Article, Paper…"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => update("author", e.target.value)}
              placeholder="Author name"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="summary">Summary (optional)</Label>
          <Textarea
            id="summary"
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
            placeholder="One sentence on why it's worth reading."
            rows={3}
          />
        </div>

        {/* Honeypot: hidden from real users via CSS, bots that fill every field will trip it */}
        <div className="hidden" aria-hidden="true">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit resource"}
        </Button>
      </form>
    </div>
  )
}
