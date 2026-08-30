// ============================================================
// products.controller.ts — the public /products routes
//
// 1. Purpose: receives requests from the client and forwards
//    them to the Product Service via ProductsService.
// 2. Called by: NestJS HTTP layer (CLIENT -> port 3000).
// 3. Calls: ProductsService (function call via DI), which makes
//    the actual HTTP call to the Product Service.
// 4. Communication: HTTP in (from client) -> function call ->
//    HTTP out (to Product Service).
// 5. Why it exists: THE central idea of the gateway: the client
//    never sees http://localhost:3001. It only knows :3000.
//    If the Product Service moves to another machine, only the
//    gateway's env changes — clients are unaffected.
//    Note: no DTOs here — a real gateway would validate and
//    authenticate requests at this point.
// ============================================================

import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: unknown) {
    return this.productsService.createProduct(dto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('seller/:sellerId')
  findBySeller(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.productsService.findBySeller(sellerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
}
