// ============================================================
// orders.controller.ts — the HTTP door for /orders routes
//
// 1. Purpose: receives HTTP requests for /orders and calls
//    OrdersService.
// 2. Called by: NestJS HTTP layer (client -> port 3002; in the
//    full system the gateway on port 3000 forwards here).
// 3. Calls: OrdersService.
// 4. Communication: HTTP in -> function call out.
// 5. Why it exists: receptionist role, thin, no logic.
//    Route order lesson again: `buyer/:buyerId` BEFORE `:id`.
// ============================================================

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders  -> create an order (starts as PENDING)
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  // GET /orders
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // GET /orders/buyer/2  -> orders placed by buyer 2
  @Get('buyer/:buyerId')
  findByBuyer(@Param('buyerId', ParseIntPipe) buyerId: number) {
    return this.ordersService.findByBuyer(buyerId);
  }

  // POST /orders/5/confirm  -> PENDING -> CONFIRMED
  @Post(':id/confirm')
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.confirm(id);
  }

  // GET /orders/5  -> must come AFTER the specific routes
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }
}
