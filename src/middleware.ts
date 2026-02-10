
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    void request;
    // Removed Supabase Auth logic as requested by user.
    // Proceed with request.
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
