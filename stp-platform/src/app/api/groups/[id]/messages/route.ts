import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: groupId } = await params;
        const session = await auth();
        if (!session || !session.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { content } = body;

        const message = await db.message.create({
            data: {
                content,
                groupId,
                senderId: session.user.id
            }
        });

        return NextResponse.json(message, { status: 201 });
    } catch (e) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
