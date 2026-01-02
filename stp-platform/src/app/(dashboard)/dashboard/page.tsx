import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await auth();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Dashboard</h2>
                    <p className="text-muted">Welcome back, {session?.user?.name || "Student"}!</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/post-trip">
                        <Button>Post a New Trip</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium">Upcoming Trips</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium">Messages</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <h3 className="text-lg font-medium">Recent Activity</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted">No recent activity found.</p>
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <h3 className="text-lg font-medium">Recommended</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted">Find peers traveling to your hometown.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
