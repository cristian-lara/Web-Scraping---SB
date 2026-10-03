const ACCESS_TOKEN_KEY = "hn_scraper_access_token";
const EMAIL_KEY = "hn_scraper_email";

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getSignedInEmail(): string | null {
  return sessionStorage.getItem(EMAIL_KEY);
}

export function isSignedIn(): boolean {
  return Boolean(getAccessToken());
}

export function persistSession(accessToken: string, email: string): void {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(EMAIL_KEY, email);
}

export function clearSession(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
}
