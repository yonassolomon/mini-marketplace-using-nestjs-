// ============================================================
// orders.controller.ts — the public /orders routes
//
// 1. Purpose: receives requests from the client and forwards
//    them to the Order Service via OrdersService.
// 2. Called by: NestJS HTTP layer (CLIENT -> port 3000).
// 3. Calls: OrdersService (function call via DI), which makes
//    the actual HTTP call to the Order Service.
// 4. Communication: HTTP in -> function call -> HTTP out.
// 5. Why it exists: same forwarding role as ProductsController.
//    The client POSTs here and gets the created order back; it
//    has no idea that the Order Service also publishes a
//    RabbitMQ event as a side effect.
// ============================================================

import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: unknown) {
    return this.ordersService.createOrder(dto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('buyer/:buyerId')
  findByBuyer(@Param('buyerId', ParseIntPipe) buyerId: number) {
    return this.ordersService.findByBuyer(buyerId);
  }

  @Post(':id/confirm')
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.confirm(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }
}
