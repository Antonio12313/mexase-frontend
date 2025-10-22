import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('@mexase/token')

    const isLoginPage = request.nextUrl.pathname === '/login'
    const isRootPage = request.nextUrl.pathname === '/'

    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && (isLoginPage || isRootPage)) {
        return NextResponse.redirect(new URL('/home', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
}