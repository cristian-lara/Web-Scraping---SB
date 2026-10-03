import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportFrontendError } from "@/lib/sentry";

export const APP_ERROR_FALLBACK_TITLE = "Something went wrong";
export const APP_ERROR_FALLBACK_HINT = "Reload the page to continue.";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo): void {
    reportFrontendError(error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main role="alert">
          <h1>{APP_ERROR_FALLBACK_TITLE}</h1>
          <p>{APP_ERROR_FALLBACK_HINT}</p>
        </main>
      );
    }
    return this.props.children;
  }
}
