import { Injectable, type ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LOG_STAGE_AUTH } from "../common/http.constants.js";
import { logStage } from "../common/structured-logger.js";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  override canActivate(context: ExecutionContext) {
    logStage(LOG_STAGE_AUTH);
    return super.canActivate(context);
  }
}
