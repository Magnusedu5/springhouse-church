import { type NextRequest, NextResponse } from 'next/server';

const DJANGO = 'http://localhost:8000/api';

async function proxy(request: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
  const { path } = await paramsPromise;
  const joined = path.join('/');
  const search = request.nextUrl.search;
  const url = `${DJANGO}/${joined}/${search}`;

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  const auth = request.headers.get('authorization');
  if (auth) headers.set('authorization', auth);

  const init: RequestInit = { method: request.method, headers };
  if (!['GET', 'HEAD'].includes(request.method)) {
    init.body = await request.text();
  }

  const upstream = await fetch(url, init);
  const body = await upstream.text();

  const responseHeaders = new Headers();
  const ct = upstream.headers.get('content-type');
  if (ct) responseHeaders.set('content-type', ct);

  return new NextResponse(body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, { params }: Ctx) { return proxy(req, params); }
export async function POST(req: NextRequest, { params }: Ctx) { return proxy(req, params); }
export async function PATCH(req: NextRequest, { params }: Ctx) { return proxy(req, params); }
export async function PUT(req: NextRequest, { params }: Ctx) { return proxy(req, params); }
export async function DELETE(req: NextRequest, { params }: Ctx) { return proxy(req, params); }
