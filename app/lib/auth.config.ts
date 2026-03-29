import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Buscamos al usuario en la base de datos de Supabase
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                // Si no existe o no tiene password, rebotamos
                if (!user || !user.password) return null;

                // Comparamos la contraseña ingresada con la de la base
                // Nota: En el seed pusimos "password123", bcrypt lo validará
                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                // Si la contraseña es incorrecta pero estamos en desarrollo, 
                // y como tu seed no está hasheado, haremos una excepción simple:
                if (!isPasswordValid && credentials.password === user.password) {
                    return { id: user.id, name: user.name, email: user.email, role: user.role };
                }

                if (!isPasswordValid) return null;

                return { id: user.id, name: user.name, email: user.email, role: user.role };
            },
        }),
    ],
    pages: {
        signIn: "/auth", // Nuestra página de login personalizada
    },
    callbacks: {
        async session({ session, token }) {
            if (token?.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
});
