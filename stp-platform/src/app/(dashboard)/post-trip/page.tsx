"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function PostTripPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // Simple FormData extraction or controlled inputs. FormData is fine.
        const formData = new FormData(e.currentTarget);
        const origin = formData.get("origin");
        const destination = formData.get("destination");
        const date = formData.get("date");
        const time = formData.get("time");
        const mode = formData.get("mode");
        const description = formData.get("description");

        const payload = { origin, destination, date, time, mode, description };

        startTransition(async () => {
            try {
                const res = await fetch("/api/trips", {
                    method: "POST",
                    body: JSON.stringify(payload),
                    headers: { "Content-Type": "application/json" }
                });

                if (res.ok) {
                    router.push("/dashboard?tripCreated=true");
                    router.refresh();
                } else {
                    const data = await res.json();
                    // Could display specific field errors if data.errors exists
                    setError(data.message || "Failed to create trip");
                }
            } catch (err) {
                setError("Something went wrong");
            }
        });
    };

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <h1 className="text-2xl font-bold">Post a Trip</h1>
                    <p className="text-muted">Share your journey and find travel buddies.</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input id="origin" name="origin" label="From" placeholder="Campus" required disabled={isPending} />
                            <Input id="destination" name="destination" label="To" placeholder="Airport / Hometown" required disabled={isPending} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input id="date" name="date" type="date" label="Date" required disabled={isPending} />
                            <Input id="time" name="time" type="time" label="Time (Approx)" disabled={isPending} />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="mode" className="text-sm font-medium">Transport Mode</label>
                            <select
                                id="mode"
                                name="mode"
                                className="flex h-10 w-full rounded-md border border-[var(--border)] bg-surface px-3 py-2 text-sm focus-visible:outline-none focus:ring-2 focus:ring-primary"
                                required
                                disabled={isPending}
                            >
                                <option value="">Select Mode...</option>
                                <option value="Cab">Cab / Taxi</option>
                                <option value="Train">Train</option>
                                <option value="Bus">Bus</option>
                                <option value="Flight">Flight</option>
                            </select>
                        </div>

                        <Input id="description" name="description" label="Notes (Optional)" placeholder="e.g. Looking for 2 people to share a cab." disabled={isPending} />

                        {error && (
                            <div className="p-3 text-sm text-error bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Posting..." : "Post Trip"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
