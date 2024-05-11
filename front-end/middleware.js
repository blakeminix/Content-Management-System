import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";


export function middleware(req) {

    const response = NextResponse.next();

    if (!req.cookies.has('uid')) {
        response.cookies.set('uid', v4());
    }

    return response;
}
/*
export const config = {
    matcher: '/'
}
*/
