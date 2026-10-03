## Purpose

Defines NestJS BFF JWT login, Bcrypt password verification, route protection, Zod DTO client errors, Helmet/CORS hardening, request throttling, and an env-seeded demo user so authenticated callers receive a Bearer-usable token and downstream services can bind work to `userId`.

## Requirements

### Requirement: Env-seeded demo user with Bcrypt hash
The BFF MUST ensure exactly one demo user exists for local login, seeded from environment variables documented in `.env.example` (e.g. `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`) via an idempotent bootstrap/seed path. The stored password MUST be a Bcrypt hash. Plaintext passwords SHALL NOT be committed outside `.env.example` documentation. Password hashes MUST NEVER appear in API response bodies.

#### Scenario: Demo user available after bootstrap
- **WHEN** the application is prepared for local use (seed and/or first-boot auth bootstrap)
- **THEN** one demo user MUST exist whose credentials match the documented env source shared by local consumers
- **AND** the persisted password MUST be stored only as a Bcrypt hash

### Requirement: Successful login issues Bearer-usable JWT (HP-AUTH)
Given valid demo credentials, the auth endpoint MUST verify the submitted password with Bcrypt against the stored hash and MUST return a JWT suitable for `Authorization: Bearer <token>`. The response MUST NOT include the password hash or plaintext password.

#### Scenario: Valid demo credentials return JWT
- **WHEN** a client submits valid demo credentials to the auth endpoint
- **THEN** the API MUST verify the password via Bcrypt
- **AND** the API MUST return a JWT usable as `Authorization: Bearer <token>` on subsequent requests
- **AND** the response body MUST NOT contain the stored password hash or plaintext password

### Requirement: Protected routes reject missing, invalid, or expired tokens (EC-401)
Protected BFF routes MUST require a valid JWT. Requests without a token, or with an invalid or expired token, MUST receive `401 Unauthorized`. Authentication SHALL be enforced by a JWT auth guard (behavior-level; exact framework class names are not mandated by this capability).

#### Scenario: Missing token on protected route
- **WHEN** a protected endpoint is called without an Authorization Bearer token
- **THEN** the API MUST respond `401 Unauthorized`

#### Scenario: Invalid or expired token on protected route
- **WHEN** a protected endpoint is called with an invalid or expired JWT
- **THEN** the API MUST respond `401 Unauthorized`

### Requirement: Authenticated userId available downstream
After a protected request passes JWT validation, the authenticated `userId` MUST be available to downstream services for ownership binding (e.g. usage attribution). Controllers MUST NOT invent a substitute identity when a valid JWT is present.

#### Scenario: Valid JWT proceeds with userId
- **WHEN** a protected endpoint is called with a valid JWT
- **THEN** the request MUST proceed past authentication
- **AND** the authenticated `userId` MUST be available to downstream services for that request

### Requirement: Zod DTO violations return client errors (EC-400)
Auth and other request DTOs validated with Zod (e.g. via `ZodValidationPipe` or nestjs-zod) MUST fail validation before business logic when the body or query violates the schema. The API MUST return `400 Bad Request` (or another 4xx client error). Validation failures MUST NOT surface as `500 Internal Server Error`.

#### Scenario: Invalid auth or query DTO
- **WHEN** an auth or query request body/query violates its Zod DTO schema
- **THEN** validation MUST reject the request before business logic runs
- **AND** the API MUST respond with `400 Bad Request` (client error)
- **AND** the API MUST NOT respond with `500 Internal Server Error` solely due to that validation failure

### Requirement: Throttle exceeded returns 429 (EC-429)
The BFF MUST enforce rate limiting (e.g. `@nestjs/throttler`). When a client exceeds the configured throttle limit, the API MUST respond `429 Too Many Requests`.

#### Scenario: Client exceeds throttle limit
- **WHEN** a client exceeds the configured request throttle
- **THEN** the API MUST respond `429 Too Many Requests`

### Requirement: Helmet and CORS enabled on BFF boot
On NestJS BFF boot, Helmet and CORS MUST be enabled for the HTTP surface so common header weaknesses are mitigated and cross-origin clients configured for the MVP can call the API.

#### Scenario: Hardening active after boot
- **WHEN** the NestJS BFF application boots
- **THEN** Helmet MUST be enabled on the HTTP surface
- **AND** CORS MUST be enabled on the HTTP surface
