import { Link, useLocation } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { isSignedIn } from "@/lib/auth-storage";

export function NotFoundPage() {
  const location = useLocation();
  const signedIn = isSignedIn();
  const homeTo = signedIn ? "/" : "/login";
  const homeLabel = signedIn ? "Go to filters" : "Sign in";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader signedIn={signedIn} />
      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-2xl flex-col items-center justify-center px-6 py-16">
        <div className="w-full rounded-md border border-border bg-card p-8">
          <p className="font-mono text-xs text-primary">404</p>
          <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
            Page not found
          </h1>
          <p className="mt-3 text-sm text-[#e0c0b1]">
            The route{" "}
            <code className="rounded-sm bg-muted px-1 font-mono text-primary">
              {location.pathname}
            </code>{" "}
            does not exist.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to={homeTo}>{homeLabel}</Link>
            </Button>
            {signedIn ? (
              <Button asChild variant="secondary">
                <Link to="/login">Back to login</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
