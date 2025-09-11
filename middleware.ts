import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    // console.log("req md", req.nextauth.token)

    // check if user is not authenticated then redirect to login page
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // check if user is authenticated and access root path then redirect to pickup page
    if (req.nextauth.token && pathname === "/") {
      return NextResponse.redirect(new URL("/pickup", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/pickup",
    "/receiving",
    "/admin",
  ],
};
