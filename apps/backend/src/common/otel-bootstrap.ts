import { context, trace } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchSpanProcessor,
  InMemorySpanExporter,
  SimpleSpanProcessor,
  type SpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import {
  ATTR_REQUEST_ID,
  ENV_OTEL_EXPORTER_OTLP_ENDPOINT,
  ENV_OTEL_TEST_INMEMORY,
  OTEL_SERVICE_NAME,
  OTEL_TRACER_NAME,
} from "./otel.constants.js";
import { getRequestId } from "./request-context.js";

let provider: NodeTracerProvider | undefined;
let testExporter: InMemorySpanExporter | undefined;

function otlpTracesUrl(endpoint: string): string {
  const base = endpoint.replace(/\/$/, "");
  if (base.endsWith("/v1/traces")) {
    return base;
  }
  return `${base}/v1/traces`;
}

/**
 * Init tracing when OTEL_TEST_INMEMORY=1 or OTEL_EXPORTER_OTLP_ENDPOINT is set.
 * Otherwise no-op (API tracer stays non-recording).
 */
export function initOtelIfConfigured(): void {
  if (provider) {
    return;
  }

  const testMode = process.env[ENV_OTEL_TEST_INMEMORY] === "1";
  const endpoint = process.env[ENV_OTEL_EXPORTER_OTLP_ENDPOINT]?.trim();

  if (!testMode && (endpoint === undefined || endpoint === "")) {
    return;
  }

  const processors: SpanProcessor[] = [];
  if (testMode) {
    testExporter = new InMemorySpanExporter();
    processors.push(new SimpleSpanProcessor(testExporter));
  } else if (endpoint) {
    processors.push(
      new BatchSpanProcessor(
        new OTLPTraceExporter({ url: otlpTracesUrl(endpoint) }),
      ),
    );
  }

  // NodeTracerProvider registers async context so getActiveSpan() works in await chains.
  const next = new NodeTracerProvider({
    resource: resourceFromAttributes({
      "service.name": OTEL_SERVICE_NAME,
    }),
    spanProcessors: processors,
  });

  next.register();
  provider = next;
}

export function getTestSpanExporter(): InMemorySpanExporter | undefined {
  return testExporter;
}

export async function resetOtelForTests(): Promise<void> {
  testExporter?.reset();
  if (provider) {
    await provider.shutdown();
    provider = undefined;
    testExporter = undefined;
  }
  // Restore no-op global so later initOtelIfConfigured can re-register.
  trace.disable();
  context.disable();
}

export async function withSpan<T>(
  name: string,
  fn: () => Promise<T>,
  attributes: Record<string, string> = {},
): Promise<T> {
  const tracer = trace.getTracer(OTEL_TRACER_NAME);
  const requestId = getRequestId();
  return tracer.startActiveSpan(name, async (span) => {
    if (requestId) {
      span.setAttribute(ATTR_REQUEST_ID, requestId);
    }
    for (const [key, value] of Object.entries(attributes)) {
      span.setAttribute(key, value);
    }
    try {
      return await fn();
    } catch (error) {
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}
