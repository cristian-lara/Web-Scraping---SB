/**
 * Typed domain failure for services. HTTP layer maps `httpStatus` → response
 * without leaking stack traces (see HttpExceptionMappingFilter).
 */
export class DomainException extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly httpStatus: number,
  ) {
    super(message);
    this.name = "DomainException";
  }
}
