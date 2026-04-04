import { RegisterInput } from "@repo/shared-types";
import { IsEmail, IsString, MinLength, IsDateString } from "class-validator";

export class RegisterDto implements RegisterInput {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  mobileNumber: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  @MinLength(6)
  password: string;
}