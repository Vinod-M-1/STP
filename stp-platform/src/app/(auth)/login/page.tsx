"use client";

import { useTransition, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        startTransition(async () => {
            try {
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    setError("Invalid email or password");
                } else {
                    router.push("/dashboard");
                    router.refresh();
                }
            } catch (err) {
                setError("Something went wrong");
            }
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
                    <p className="text-center text-[var(--text-muted)]">Sign in to your account</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        {error && (
                            <div className="p-3 text-sm text-[var(--error)] bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Signing in..." : "Sign In"}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-[var(--text-muted)]">Don't have an account? </span>
                            <Link href="/signup" className="font-semibold text-[var(--primary)] hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
