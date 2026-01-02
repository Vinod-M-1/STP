import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createTripSchema } from "@/lib/validations/trip";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validated = createTripSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({ message: "Invalid data", errors: validated.error.flatten() }, { status: 400 });
        }

        const { origin, destination, date, time, mode, description } = validated.data;

        // Use user.id from session (we mapped sub to id in callback)
        const userId = session.user.id;

        if (!userId) { // Fallback/Safety
            return NextResponse.json({ message: "User ID not found" }, { status: 500 });
        }

        const trip = await db.trip.create({
            data: {
                origin,
                destination,
                date: new Date(date), // Parse string to Date object
                time,
                mode,
                description,
                userId: userId,
                group: {
                    create: {
                        name: `${origin} to ${destination} Group`,
                        members: {
                            create: {
                                userId: userId,
                                role: "ADMIN"
                            }
                        }
                    }
                }
            },
        });

        return NextResponse.json({ message: "Trip created", tripId: trip.id }, { status: 201 });
    } catch (error) {
        console.error("Create Trip Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session) { // Allow viewing trips if public? Or restrict? Let's restrict for safety as per plan "Student-only"
            // But for hackathon demo, maybe public? No, keep it secure.
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const trips = await db.trip.findMany({
            orderBy: { date: 'asc' },
            include: {
                user: {
                    select: { name: true, image: true, university: true }
                }
            }
        });

        return NextResponse.json(trips, { status: 200 });
    } catch (error) {
        console.error("Fetch Trips Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
