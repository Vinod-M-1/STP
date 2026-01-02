import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // We only validate name, email, password here, confirmPassword handled in UI or strict schema
        // Adjust schema safely
        const { name, email, password } = body;

        // Manual validation or use strict schema partial validation
        if (!email || !password || !name) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: "User created", userId: user.id }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({
            message: error instanceof Error ? error.message : "Internal Server Error",
            details: String(error)
        }, { status: 500 });
    }
}
