import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { paths }: { paths: string[] } = await req.json();
  for (const path of paths) {
    revalidatePath(path);
  }
  return NextResponse.json({ revalidated: paths });
}
