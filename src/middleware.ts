import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;




  if (!token) {
  
    return NextResponse.redirect(new URL("/login", request.url));
  }

  
  if (!role) {
   
    return NextResponse.redirect(new URL("/login", request.url));
  }

  
  if (role === "ADMIN") {
  
    if (request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url)); 
    }
  } else if (role === "user") {
  
    if (request.nextUrl.pathname.startsWith("/user")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url)); 
    }
  } else if (role === "SERVICE_PROVIDER") {
  
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url)); 
    }
  } else {
   
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/admin/:path*", "/admin"], 
};
