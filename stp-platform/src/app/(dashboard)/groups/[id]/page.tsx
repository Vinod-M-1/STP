import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

// We'll create a Client Component for the Chat part later
// For now, let's build the server page structure
import ChatInterface from "./chat-interface";

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: tripId } = await params;
    const session = await auth();

    if (!session) redirect("/login");

    // Find the trip and its group
    // Note: params.id is tripId based on my previous link logic (/groups/${trip.id})
    // But my schema says Trip <-> Group via tripId.
    // Let's find the group associated with this tripId.

    const trip = await db.trip.findUnique({
        where: { id: tripId },
        include: {
            group: {
                include: {
                    members: { include: { user: true } },
                    messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } }
                }
            }
        }
    });

    if (!trip) return notFound();

    // If group missing (legacy trips), maybe create it? 
    // For now, assume it exists due to our API change.
    if (!trip.group) {
        return <div>Group not found for this trip.</div>;
    }

    const isMember = trip.group.members.some(m => m.userId === session.user?.id);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-10rem)]">
            <Card className="flex-shrink-0">
                <CardHeader>
                    <h1 className="text-2xl font-bold">{trip.origin} → {trip.destination}</h1>
                    <p className="text-muted">
                        {new Date(trip.date).toLocaleDateString()} at {trip.time} • {trip.mode}
                    </p>
                </CardHeader>
            </Card>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-0">
                <Card className="md:col-span-3 flex flex-col min-h-0">
                    <CardHeader className="border-b py-3">
                        <h3 className="font-semibold">Live Chat</h3>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 min-h-0 relative">
                        <ChatInterface
                            groupId={trip.group.id}
                            initialMessages={trip.group.messages}
                            currentUser={session.user}
                            isMember={isMember}
                        />
                    </CardContent>
                </Card>

                <Card className="md:col-span-1 overflow-y-auto">
                    <CardHeader>
                        <h3 className="font-semibold">Travelers ({trip.group.members.length})</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {trip.group.members.map(member => (
                                <div key={member.id} className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                                        {member.user.name?.[0] || "?"}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium leading-none">{member.user.name}</p>
                                        <p className="text-xs text-muted">
                                            {member.role === "ADMIN" ? "Organizer" : "Member"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
