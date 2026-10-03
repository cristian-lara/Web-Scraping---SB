import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { AnalyticsModule } from "./analytics/analytics.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { AppThrottlerGuard } from "./common/app-throttler.guard.js";
import {
  DEFAULT_THROTTLE_LIMIT,
  DEFAULT_THROTTLE_TTL_MS,
} from "./common/env.constants.js";
import { FilterModule } from "./filtering/filter.module.js";
import { ScrapingModule } from "./scraping/scraping.module.js";

function throttleTtlMs(): number {
  const raw = process.env.THROTTLE_TTL_MS;
  if (raw === undefined || raw === "") {
    return DEFAULT_THROTTLE_TTL_MS;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : DEFAULT_THROTTLE_TTL_MS;
}

function throttleLimit(): number {
  const raw = process.env.THROTTLE_LIMIT;
  if (raw === undefined || raw === "") {
    return DEFAULT_THROTTLE_LIMIT;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : DEFAULT_THROTTLE_LIMIT;
}

@Module({
  imports: [
    // forRootAsync so tests can set THROTTLE_* before createApp().
    ThrottlerModule.forRootAsync({
      useFactory: () => [
        {
          ttl: throttleTtlMs(),
          limit: throttleLimit(),
        },
      ],
    }),
    AuthModule,
    FilterModule,
    ScrapingModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
  ],
})
export class AppModule {}
