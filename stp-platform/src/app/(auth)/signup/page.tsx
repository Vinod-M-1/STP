"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function SignupPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    body: JSON.stringify({ name, email, password }),
                    headers: { "Content-Type": "application/json" }
                });

                if (res.ok) {
                    router.push("/login?registered=true");
                } else {
                    const data = await res.json();
                    setError(data.message || "Registration failed");
                    console.error("Signup error details:", data);
                }
            } catch (err: any) {
                console.error("Signup exception:", err);
                setError(err.message || "Something went wrong. Check console.");
            }
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h1 className="text-2xl font-bold text-center">Create Account</h1>
                    <p className="text-center text-[var(--text-muted)]">Join your campus community</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            id="name"
                            name="name"
                            label="Full Name"
                            placeholder="John Doe"
                            required
                            disabled={isPending}
                        />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="University Email"
                            placeholder="student@university.edu"
                            required
                            disabled={isPending}
                        />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            required
                            disabled={isPending}
                        />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            required
                            disabled={isPending}
                        />

                        {error && (
                            <div className="p-3 text-sm text-[var(--error)] bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Creating Account..." : "Sign Up"}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-[var(--text-muted)]">Already have an account? </span>
                            <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
