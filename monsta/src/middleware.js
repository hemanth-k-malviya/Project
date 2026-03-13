import { NextResponse } from "next/server";

export function middleware(request) {
    //redirect if user is not  logged in
    const isLoggedIn = request.cookies.get('user_login')?.value;

    if ((!isLoggedIn) && request.nextUrl.pathname.startsWith('/my-dashboard')) {
        return NextResponse.redirect(new URL('/login-register', request.url))
    }
    if ((isLoggedIn) && request.nextUrl.pathname.startsWith('/login-register')) {
        return NextResponse.redirect(new URL('/my-dashboard', request.url))
    }
}
    // Handle simple requests
    const response = NextResponse.next()
    return response;