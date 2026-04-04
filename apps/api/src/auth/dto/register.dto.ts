import { RegisterInput } from "@repo/shared-types";
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto implements RegisterInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}