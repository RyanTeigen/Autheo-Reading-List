// Serverless function: opens a GitHub issue for a suggested reading-list resource.
//
// Written against the Web-standard Request/Response signature used by most modern
// edge/serverless runtimes (Vercel Edge, Netlify Edge, Cloudflare Workers, Deno Deploy).
// Shadw.cloud's exact function convention wasn't documented anywhere I could reach during
// planning ("Serverless functions" was listed as a supported content type, but the file/
// entrypoint convention wasn't spelled out) — if Shadw expects Node's (req, res) callback
// style instead, only the export signature at the bottom needs to change; the logic below
// is runtime-agnostic.

const GITHUB_REPO = process.env.GITHUB_REPO ?? "RyanTeigen/Autheo-Reading-List"
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

interface ContributePayload {
  category: string
  title: string
  url: string
  type: string
  author: string
  summary: string
  website?: string // honeypot
}

function isValidPayload(body: unknown): body is ContributePayload {
  if (!body || typeof body !== "object") return false
  const b = body as Record<string, unknown>
  return (
    typeof b.category === "string" &&
    typeof b.title === "string" &&
    typeof b.url === "string" &&
    typeof b.type === "string" &&
    typeof b.author === "string"
  )
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json(400, { error: "Invalid JSON body" })
  }

  if (!isValidPayload(body)) {
    return json(400, { error: "Missing required fields" })
  }

  // Honeypot: real users never see or fill this field. Pretend success so bots
  // don't learn to adapt, but skip the actual GitHub call.
  if (body.website) {
    return json(200, { issueUrl: null })
  }

  const title = body.title.trim()
  const author = body.author.trim()
  const type = body.type.trim()
  const category = body.category.trim()
  const summary = (body.summary ?? "").trim()

  if (!title || !author || !type || !category) {
    return json(400, { error: "Please fill in all required fields." })
  }

  let url: URL
  try {
    url = new URL(body.url)
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("bad protocol")
  } catch {
    return json(400, { error: "Enter a valid URL, including https://." })
  }

  if (!GITHUB_TOKEN) {
    return json(500, { error: "Server is not configured to accept submissions right now." })
  }

  const issueBody = [
    `**Category:** \`${category}.md\``,
    "",
    "Suggested entry to add:",
    "",
    "```md",
    `### [${title}](${url.toString()})`,
    `**Type:** ${type}  `,
    `**Author:** ${author}  `,
    `**Summary:** ${summary || "_(none provided)_"}`,
    "```",
  ].join("\n")

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      title: `New resource: ${title}`,
      body: issueBody,
      labels: ["new-resource"],
    }),
  })

  if (!res.ok) {
    return json(502, { error: "Failed to submit your suggestion. Please try again later." })
  }

  const data = (await res.json()) as { html_url: string }
  return json(200, { issueUrl: data.html_url })
}
