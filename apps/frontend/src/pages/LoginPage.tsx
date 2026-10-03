import { zodResolver } from "@hookform/resolvers/zod";
import { LoginBodySchema, type LoginBody } from "@repo/shared-types";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginRequest } from "@/lib/api";
import { persistSession } from "@/lib/auth-storage";

export function LoginPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<LoginBody>({
    resolver: zodResolver(LoginBodySchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginBody) {
    setSubmitError(null);
    try {
      const token = await loginRequest(values);
      persistSession(token, values.email);
      void navigate("/");
    } catch {
      setSubmitError("Sign-in failed. Check credentials and try again.");
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <div className="flex min-h-screen flex-col bg-[#0d0e13]">
      <header className="border-b border-border px-6 py-3 font-mono text-xs text-muted-foreground">
        HN Scraper Internal Auth
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-md border border-border bg-card p-8 shadow-xl">
          <h1 className="font-heading text-4xl font-bold tracking-tight">
            HN Scraper
          </h1>
          <p className="mt-2 text-sm text-[#e0c0b1]">
            Sign in to filter Hacker News entries.
          </p>
          <form
            className="mt-8 flex flex-col gap-5"
            onSubmit={(event) => {
              void form.handleSubmit(onSubmit)(event);
            }}
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(form.formState.errors.email)}
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive" role="alert">
                  Enter a valid email.
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(form.formState.errors.password)}
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <p className="text-xs text-destructive" role="alert">
                  Password cannot be empty.
                </p>
              ) : null}
            </div>
            {submitError ? (
              <p className="text-sm text-destructive" role="alert">
                {submitError}
              </p>
            ) : null}
            <Button disabled={submitting} size="lg" type="submit">
              {submitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
