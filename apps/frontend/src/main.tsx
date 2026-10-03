import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { initFrontendSentry } from "@/lib/sentry";
import "@/index.css";

initFrontendSentry();

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root");
}

createRoot(root).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);
