import type { NextRequest } from "next/server";

/**
 * Same-origin proxy to the ADK backend.
 *
 * The browser calls `/api/adk/<path>`; this handler forwards to the Python
 * server and streams the response back untouched (SSE included). Point
 * `ADK_SERVER_URL` at a Cloud Run URL later — no frontend change needed.
 */

const SERVER = (process.env.ADK_SERVER_URL ?? "http://127.0.0.1:48700").replace(/\/$/, "");

async function forward(req: NextRequest, path: string[]): Promise<Response> {
  const target = `${SERVER}/${path.join("/")}${req.nextUrl.search}`;

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const accept = req.headers.get("accept");
  if (accept) headers.set("accept", accept);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
      cache: "no-store",
      // @ts-expect-error — Node fetch requires duplex for streamed uploads
      duplex: hasBody ? "half" : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      {
        error: "adk_unreachable",
        message: `Could not reach the ADK server at ${SERVER}. ${message}`,
        hint: "Start it with: uv run adk api_server --port 8000",
      },
      { status: 502 },
    );
  }

  const out = new Headers();
  for (const key of ["content-type", "cache-control", "connection"]) {
    const value = upstream.headers.get(key);
    if (value) out.set(key, value);
  }
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
