// ============================================================
// create-product.dto.ts — DTO for creating a product
//
// 1. Purpose: validates the JSON body of a POST /products request.
// 2. Called by: the global ValidationPipe (main.ts).
// 3. Calls: nothing.
// 4. Communication: function call (validation rules only).
// 5. Why it exists: same idea as create-user.dto.ts — request
//    bodies must be validated before reaching business logic.
//    Note: `price` is a number here, but Prisma stores it as
//    Decimal(10,2) — Prisma converts automatically.
// ============================================================

import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  // sellerId must be an existing user id (validated in service)
  @IsInt()
  sellerId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  // money: must be a positive number, max 2 decimals
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;
}
