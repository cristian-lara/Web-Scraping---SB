import { Body, Controller, HttpCode, Inject, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { LoginBodySchema, type LoginBody } from "@repo/shared-types";
import {
  AUTH_LOGIN_ROUTE,
  AUTH_ROUTE_PREFIX,
  HTTP_STATUS_OK,
} from "../common/http.constants.js";
import { ZodValidationPipe } from "../common/zod-validation.pipe.js";
import { AuthService, type LoginResult } from "./auth.service.js";

@ApiTags(AUTH_ROUTE_PREFIX)
@Controller(AUTH_ROUTE_PREFIX)
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  @Post(AUTH_LOGIN_ROUTE)
  @HttpCode(HTTP_STATUS_OK)
  @ApiOperation({ summary: "Demo JWT login" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 1 },
      },
    },
  })
  @ApiOkResponse({
    description: "Bearer-usable JWT",
    schema: {
      type: "object",
      required: ["access_token"],
      properties: {
        access_token: { type: "string" },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Zod validation failed" })
  @ApiUnauthorizedResponse({ description: "Invalid credentials" })
  login(
    @Body(new ZodValidationPipe(LoginBodySchema)) body: LoginBody,
  ): Promise<LoginResult> {
    return this.authService.login(body);
  }
}
