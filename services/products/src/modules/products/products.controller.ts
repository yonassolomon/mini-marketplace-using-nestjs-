// ============================================================
// products.controller.ts — the HTTP door for /products routes
//
// 1. Purpose: receives HTTP requests for /products and calls
//    ProductsService.
// 2. Called by: NestJS HTTP layer (client -> port 3001).
//    (In the full system the client talks to the gateway on
//    port 3000, which forwards here — Phase 6 explains this.)
// 3. Calls: ProductsService (function call via DI).
// 4. Communication: HTTP in -> function call out.
// 5. Why it exists: same receptionist role as UsersController.
//
// IMPORTANT ROUTE ORDERING LESSON:
// NestJS checks routes top-to-bottom. `seller/:sellerId` MUST be
// declared BEFORE `:id`, otherwise a GET /products/seller/2 would
// be matched by `:id` first ("seller" would be parsed as an id).
// ============================================================

import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // POST /products
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  // GET /products
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // GET /products/seller/2  -> products of seller with id 2
  @Get('seller/:sellerId')
  findBySeller(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.productsService.findBySeller(sellerId);
  }

  // GET /products/5  -> must come AFTER the specific routes
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
}
