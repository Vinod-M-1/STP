import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 h-16 flex items-center border-b bg-surface sticky top-0 z-50">
        <div className="container flex items-center justify-between">
          <Link className="flex items-center justify-center font-bold text-xl text-primary" href="#">
            CampusGo
          </Link>
          <nav className="flex gap-4 items-center">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
              Log In
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-24 bg-surface">
          <div className="container px-4">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold sm:text-5xl text-primary">
                  Travel Together. Save Money.
                </h1>
                <p className="mx-auto max-w-[700px] text-muted text-lg">
                  The exclusive student travel platform. Find peers, share rides, and journey safely to your destination.
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg">Join Now</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">Sign In</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-surface shadow-sm">
                <h3 className="text-xl font-bold">Verified Students</h3>
                <p className="text-muted">Connect only with verified peers from your university.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-surface shadow-sm">
                <h3 className="text-xl font-bold">Smart Matching</h3>
                <p className="text-muted">Find others traveling on the same route and time instantly.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-surface shadow-sm">
                <h3 className="text-xl font-bold">Secure Chat</h3>
                <p className="text-muted">Coordinate details safely within the platform.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center px-4 border-t bg-surface">
        <div className="container flex flex-col sm:flex-row justify-between items-center w-full">
          <p className="text-xs text-muted">© 2024 CampusGo. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link className="text-xs hover:underline" href="#">
              Terms
            </Link>
            <Link className="text-xs hover:underline" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
