// ============================================================
// create-order.dto.ts — DTO for placing an order
//
// 1. Purpose: validates the JSON body of POST /orders.
// 2. Called by: the global ValidationPipe (main.ts).
// 3. Calls: nothing.
// 4. Communication: function call (validation rules only).
// 5. Why it exists: defines EXACTLY what a client may send:
//    buyerId + productId + quantity. `status` is NOT here —
//    it is set by the service (PENDING by default, CONFIRMED
//    later via the confirm endpoint). Clients never set status.
// ============================================================

import { IsInt, Min } from 'class-validator';

export class CreateOrderDto {
  // who is buying (must be a BUYER — checked in the service)
  @IsInt()
  buyerId!: number;

  // WHICH product. Note: we do NOT validate that this product
  // exists — the product lives in another service's database
  // (the microservices limitation explained in schema.prisma).
  @IsInt()
  productId!: number;

  // how many units (at least 1)
  @IsInt()
  @Min(1)
  quantity!: number;
}
