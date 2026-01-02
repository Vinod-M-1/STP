"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ActivateChatButton({ tripId }: { tripId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleActivate = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/trips/${tripId}/group`, { method: "POST" });
            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to create group");
            }
        } catch (e) {
            console.error(e);
            alert("Error creating group");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <h3 className="text-lg font-semibold">Chat not initialized</h3>
            <p className="text-muted max-w-sm">
                The group chat for this trip hasn't been created yet.
            </p>
            <Button onClick={handleActivate} disabled={isLoading}>
                {isLoading ? "Activating..." : "Initialize Chat Group"}
            </Button>
        </div>
    );
}
