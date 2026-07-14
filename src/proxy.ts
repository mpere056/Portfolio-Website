import { NextResponse, type NextRequest } from 'next/server';
import { PROJECT_SITES } from '@/lib/projectSites';

const ROOT_DOMAIN = 'marknperera.ca';
const RESERVED_SUBDOMAINS = new Set(['www', 'api']);
const PROJECT_SUBDOMAINS = new Set(PROJECT_SITES.map((site) => site.subdomain));

export function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const hostname = (forwardedHost ?? request.nextUrl.hostname)
    .split(',')[0]
    .trim()
    .split(':')[0]
    .toLowerCase();
  const suffix = `.${ROOT_DOMAIN}`;

  if (request.nextUrl.pathname.startsWith('/sites/')) {
    return NextResponse.next();
  }

  if (!hostname.endsWith(suffix)) {
    return NextResponse.next();
  }

  const subdomain = hostname.slice(0, -suffix.length);

  if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain) || !PROJECT_SUBDOMAINS.has(subdomain)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/sites/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|models|audio).*)'],
};
