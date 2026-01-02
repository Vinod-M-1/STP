import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: groupId } = await params;
        const session = await auth();
        if (!session || !session.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Check if already member
        const existing = await db.groupMember.findUnique({
            where: {
                groupId_userId: {
                    groupId,
                    userId: session.user.id
                }
            }
        });

        if (existing) return NextResponse.json({ message: "Already joined" }, { status: 200 });

        await db.groupMember.create({
            data: {
                groupId,
                userId: session.user.id,
                role: "MEMBER"
            }
        });

        return NextResponse.json({ message: "Joined successfully" }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
