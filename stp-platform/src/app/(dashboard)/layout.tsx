import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-surface">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex gap-6 items-center">
                        <Link href="/dashboard" className="flex items-center">
                            <span className="font-bold text-primary text-xl">CampusGo</span>
                        </Link>
                        <nav className="flex gap-6 hidden sm:flex">
                            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                                Dashboard
                            </Link>
                            <Link href="/post-trip" className="text-sm font-medium text-muted hover:text-primary">
                                Post Trip
                            </Link>
                            <Link href="/trips" className="text-sm font-medium text-muted hover:text-primary">
                                Find Rides
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted hidden sm:inline-block">
                                {session?.user?.name || session?.user?.email}
                            </span>
                            <form action={async () => {
                                "use server";
                                await signOut();
                            }}>
                                <Button variant="ghost" size="sm">Sign Out</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 container py-6">{children}</main>
        </div>
    );
}
