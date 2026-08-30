// ============================================================
// create-user.dto.ts — DTO (Data Transfer Object) for creating users
//
// 1. Purpose: describes + validates the JSON body of a POST /users
//    request. Only `name` and `role` are allowed.
// 2. Called by: the ValidationPipe (global, in main.ts) which
//    checks the incoming request body against these rules.
// 3. Calls: nothing.
// 4. Communication: function call (the pipe reads these rules);
//    no network traffic.
// 5. Why it exists: never trust the client. Validation rules live
//    here with class-validator decorators (@IsString, @IsEnum...).
//    With whitelist:true, unknown fields are stripped away.
// ============================================================

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@prisma/client'; // reuse the enum defined in schema.prisma

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  // @IsEnum checks that `role` is one of SELLER or BUYER
  @IsEnum(Role)
  role!: Role;
}
