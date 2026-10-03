import {
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { LoginBody } from "@repo/shared-types";
import bcrypt from "bcrypt";
import { bootstrapDemoUser } from "./demo-user.store.js";

export type LoginResult = {
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async login(body: LoginBody): Promise<LoginResult> {
    const user = await bootstrapDemoUser();
    const emailMatches =
      body.email.toLowerCase() === user.email.toLowerCase();
    const passwordMatches = await bcrypt.compare(
      body.password,
      user.passwordHash,
    );

    if (!emailMatches || !passwordMatches) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { access_token };
  }
}
