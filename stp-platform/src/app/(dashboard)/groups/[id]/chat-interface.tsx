"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type Message = {
    id: string;
    content: string;
    sender: { name: string | null };
    createdAt: Date | string;
};

type User = {
    id?: string;
    name?: string | null;
    email?: string | null;
}

export default function ChatInterface({
    groupId,
    initialMessages,
    currentUser,
    isMember
}: {
    groupId: string;
    initialMessages: any[];
    currentUser: User;
    isMember: boolean;
}) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Polling for new messages
    useEffect(() => {
        if (!isMember) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/groups/${groupId}/messages`);
                if (res.ok) {
                    const latestMessages = await res.json();
                    if (latestMessages.length > messages.length) {
                        setMessages(latestMessages);
                    }
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [groupId, isMember, messages.length]);

    const handleJoin = async () => {
        setIsJoining(true);
        try {
            await fetch(`/api/groups/${groupId}/join`, { method: "POST" });
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setIsJoining(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsSending(true);
        try {
            const res = await fetch(`/api/groups/${groupId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage })
            });

            if (res.ok) {
                const savedMsg = await res.json();
                // Optimistic update or wait for refresh? 
                // Let's append manually for speed
                setMessages([...messages, {
                    ...savedMsg,
                    sender: { name: currentUser.name }, // Hack for instant display
                    createdAt: new Date().toISOString()
                }]);
                setNewMessage("");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSending(false);
        }
    };

    if (!isMember) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 bg-slate-50">
                <p className="text-muted">Join this group to chat with travelers.</p>
                <Button onClick={handleJoin} disabled={isJoining}>
                    {isJoining ? "Joining..." : "Join Group"}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full absolute inset-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg: any) => {
                    const isMe = msg.senderId === currentUser.id || msg.sender?.email === currentUser.email;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe ? "bg-primary text-white" : "bg-slate-100 text-slate-800"
                                }`}>
                                {!isMe && <p className="text-xs font-bold opacity-70 mb-1">{msg.sender.name}</p>}
                                <p className="text-sm">{msg.content}</p>
                                <span className="text-[10px] opacity-70 block text-right mt-1">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="p-4 border-t bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isSending}
                    />
                    <Button type="submit" disabled={isSending}>Send</Button>
                </form>
            </div>
        </div>
    );
}
