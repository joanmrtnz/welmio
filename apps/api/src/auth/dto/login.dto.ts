import { LoginInput } from "@repo/shared-types";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto implements LoginInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}