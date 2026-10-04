import type { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module.js";
import { bootstrapDemoUser } from "./auth/demo-user.store.js";
import { correlationMiddleware } from "./common/correlation.middleware.js";
import { HttpExceptionMappingFilter } from "./common/http-exception-mapping.filter.js";
import { initOtelIfConfigured } from "./common/otel-bootstrap.js";
import { initSentryIfConfigured } from "./common/sentry-client.js";
import { setupSwagger } from "./common/swagger.setup.js";

/**
 * Shared Nest bootstrap (dev + tests).
 *
 * ESM compromise: package is "type":"module" + NodeNext. Runtime uses tsx
 * (no emitDecoratorMetadata), so constructors use explicit @Inject(...).
 * Vitest still uses unplugin-swc for Nest HTTP tests. Demo user remains
 * in-memory; UsageLog uses Prisma SQLite (prisma/app.db).
 */
export function configureApp(app: INestApplication): void {
  app.use(helmet());
  app.enableCors();
  app.use(correlationMiddleware);
  app.useGlobalFilters(new HttpExceptionMappingFilter());
  setupSwagger(app);
}

export async function createApp(): Promise<INestApplication> {
  initOtelIfConfigured();
  initSentryIfConfigured();
  await bootstrapDemoUser();

  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"],
  });

  configureApp(app);

  return app;
}
