import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: tripId } = await params;
        const session = await auth();

        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const trip = await db.trip.findUnique({
            where: { id: tripId },
            include: { group: true }
        });

        if (!trip) return NextResponse.json({ message: "Trip not found" }, { status: 404 });
        if (trip.group) return NextResponse.json({ message: "Group already exists" }, { status: 200 });

        // Create the group
        await db.group.create({
            data: {
                name: `${trip.origin} to ${trip.destination} Group`,
                tripId: trip.id,
                members: {
                    create: {
                        userId: session.user.id,
                        role: "ADMIN"
                    }
                }
            }
        });

        return NextResponse.json({ message: "Group created" }, { status: 201 });
    } catch (error) {
        console.error("Create Group Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
