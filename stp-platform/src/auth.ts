import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const validated = loginSchema.safeParse(credentials);
                if (!validated.success) return null;

                const { email, password } = validated.data;

                // Note: db call generally works in node env (auth.ts)
                const user = await db.user.findUnique({
                    where: { email }
                });

                if (!user || !user.password) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (passwordsMatch) return user;

                return null;
            }
        })
    ],
});
