import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("user");
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === "/login";
  const isProtectedPage = pathname.startsWith("/dashboard");

  if (isLoginPage && userCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedPage && !userCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
