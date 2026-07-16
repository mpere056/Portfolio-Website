import { NextResponse } from 'next/server'
import { fetchContext } from '@/lib/retriever'

export const runtime = 'nodejs'

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
        FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      }
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}


