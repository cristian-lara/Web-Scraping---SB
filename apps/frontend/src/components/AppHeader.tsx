import { Link } from "react-router-dom";
import { clearSession, getSignedInEmail } from "@/lib/auth-storage";

type AppHeaderProps = {
  signedIn?: boolean;
};

export function AppHeader({ signedIn = false }: AppHeaderProps) {
  const email = getSignedInEmail();

  return (
    <header className="border-b border-border bg-[#0d0e13]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-xs font-bold text-primary-foreground">
            HN
          </span>
          <span className="font-heading text-base font-semibold tracking-tight">
            HN Scraper
          </span>
        </div>
        {signedIn ? (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-mono text-xs">{email ?? "Signed in"}</span>
            <Link
              className="hover:text-foreground"
              to="/login"
              onClick={() => {
                clearSession();
              }}
            >
              Sign out
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
