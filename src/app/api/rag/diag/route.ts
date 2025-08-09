import { NextResponse } from 'next/server'
import { fetchContext } from '@/lib/retriever'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || 'projects'
  try {
    const { context, slugs } = await fetchContext(q, 4)
    return NextResponse.json({
      ok: true,
      q,
      ctxChars: context.length,
      slugs,
      env: {
        GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY,
        NEXT_PUBLIC_SUPA_URL: !!process.env.NEXT_PUBLIC_SUPA_URL,
        NEXT_PUBLIC_SUPA_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPA_ANON_KEY,
      }
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}


