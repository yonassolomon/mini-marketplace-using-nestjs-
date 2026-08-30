// ============================================================
// create-user.dto.ts — DTO for creating a user
//
// 1. Purpose: validates the JSON body of POST /users.
// 2. Called by: the global ValidationPipe (main.ts).
// 3. Calls: nothing.
// 4. Communication: function call (validation rules only).
// 5. Why it exists: identical to the Product Service version —
//    but remember this is a DIFFERENT database. A buyer created
//    here does NOT exist in the products database. Each service
//    owns its own copy of the users it cares about.
// ============================================================

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(Role)
  role!: Role;
}
