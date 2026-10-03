import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  SWAGGER_PATH,
  SWAGGER_TITLE,
  SWAGGER_VERSION,
} from "./http.constants.js";

/** Wire Swagger UI + OpenAPI document (HP-SWAG). */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription("Auth + filter HTTP contract for the HN scraper MVP")
    .setVersion(SWAGGER_VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
}
