import type { NextRequest } from "next/server";

/**
 * Same-origin proxy to the ADK backends.
 *
 * The browser calls `/api/adk/<path>`; this handler forwards to a Python server
 * and streams the response back untouched (SSE included).
 *
 * There are two backends because ADK discovers apps by scanning a directory,
 * while `adk deploy --extra_packages` stages packages somewhere the scanner does
 * not look (verified: the loader scans `/app/agents`, extra packages land in
 * `/app`). Deploying Agent Regulasi as its own service is simpler than fighting
 * that, so the proxy chooses per app.
 *
 * Resolution order:
 *   1. `/apps/nata_regulasi/...`  -> ADK_REGULASI_SERVER_URL
 *   2. `/run_sse` whose body names nata_regulasi -> ADK_REGULASI_SERVER_URL
 *   3. everything else -> ADK_SERVER_URL
 *
 * Falling back to the main backend keeps local development working with a single
 * `adk api_server`, which serves every app in the repo.
 */

const MAIN = (process.env.ADK_SERVER_URL ?? "http://127.0.0.1:48700").replace(/\/$/, "");
/** Unset locally, so local dev stays single-backend. */
const REGULASI = (process.env.ADK_REGULASI_SERVER_URL ?? "").replace(/\/$/, "");

/** Pick the backend for a request, based on the path (and body, for run_sse). */
function backendFor(path: string[], body: ArrayBuffer | undefined): string {
  if (!REGULASI) return MAIN;

  // The app name appears as the second segment of `/apps/<app>/...`.
  if (path[0] === "apps" && path[1] === "nata_regulasi") return REGULASI;

  // `run_sse` carries the app name in its JSON body instead of the path.
  if (body && path[0] === "run_sse") {
    try {
      const parsed = JSON.parse(new TextDecoder().decode(body)) as { appName?: string };
      if (parsed.appName === "nata_regulasi") return REGULASI;
    } catch {
      // Not JSON or not something we understand: let the main backend answer.
    }
  }

  return MAIN;
}

async function forward(req: NextRequest, path: string[]): Promise<Response> {
  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const accept = req.headers.get("accept");
  if (accept) headers.set("accept", accept);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  // Read the body once: it is needed both to choose a backend and to forward.
  const body = hasBody ? await req.arrayBuffer() : undefined;
  const server = backendFor(path, body);

  const target = `${server}/${path.join("/")}${req.nextUrl.search}`;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
      // @ts-expect-error — Node fetch requires duplex for streamed uploads
      duplex: hasBody ? "half" : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      {
        error: "adk_unreachable",
        message: `Could not reach the ADK server at ${server}. ${message}`,
        hint: "Locally: uv run adk api_server --port 48700",
      },
      { status: 502 },
    );
  }

  const out = new Headers();
  for (const key of ["content-type", "cache-control", "connection"]) {
    const value = upstream.headers.get(key);
    if (value) out.set(key, value);
  }

  // Disable buffering across Cloud Run, Nginx, and CDNs for immediate SSE token delivery
  out.set("X-Accel-Buffering", "no");
  out.set("Cache-Control", "no-cache, no-transform");

  return new Response(upstream.body, { status: upstream.status, headers: out });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
