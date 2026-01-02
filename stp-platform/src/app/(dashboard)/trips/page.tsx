import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function TripsPage() {
    const session = await auth();

    const trips = await db.trip.findMany({
        orderBy: { date: 'asc' },
        include: {
            user: {
                select: { name: true, university: true }
            }
        }
    });

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Find a Ride</h2>
                    <p className="text-muted">Discover students traveling your way.</p>
                </div>
                <Link href="/post-trip">
                    <Button>Post a Trip</Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trips.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted">
                        No trips found. Be the first to post one!
                    </div>
                ) : (
                    trips.map((trip) => (
                        <Card key={trip.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="text-sm font-medium text-primary bg-blue-50 px-2 py-1 rounded">
                                        {trip.mode}
                                    </div>
                                    <span className="text-sm text-muted">
                                        {new Date(trip.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold mt-2">
                                    {trip.origin} <span className="text-muted mx-1">→</span> {trip.destination}
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-4 text-sm text-muted">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                        {trip.user.name?.[0] || "U"}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{trip.user.name}</p>
                                        <p className="text-xs">{trip.user.university || "Student"}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted line-clamp-2 mb-4">
                                    {trip.description || "No description provided."}
                                </p>
                                <Link href={`/groups/${trip.id}`} className="w-full">
                                    <Button variant="outline" className="w-full">
                                        Join / Chat
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
