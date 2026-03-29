import { auth } from "@/app/lib/auth.config";

// Next 16 necesita que el export se llame "proxy" o sea un default export
export default auth((req) => {
    // Si no hay sesión y el usuario intenta entrar a /dashboard, lo mandamos al login
    if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
        const newUrl = new URL("/auth", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
});

export const config = {
    matcher: ["/dashboard/:path*"],
};
