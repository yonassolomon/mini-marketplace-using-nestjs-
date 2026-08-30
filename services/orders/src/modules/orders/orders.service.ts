// ============================================================
// orders.service.ts — the business logic for orders
//
// 1. Purpose: places orders, lists them, and confirms them.
// 2. Called by: OrdersController (function call via DI).
//    IMPORTANT: in Phase 4 this service ALSO publishes a
//    RabbitMQ event after creating an order — you will see the
//    publisher call added to `create()`.
// 3. Calls: PrismaService.
// 4. Communication: Dependency Injection + Database query.
// 5. Why it exists: the business rules of ordering:
//    - only a BUYER may place an order (mirror of the seller rule)
//    - new orders start as PENDING
//    - only PENDING orders can be confirmed
// ============================================================

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // Place a new order.
  async create(dto: CreateOrderDto) {
    // Business rule: the buyer must exist and have role BUYER.
    const buyer = await this.prisma.user.findUnique({
      where: { id: dto.buyerId },
    });

    if (!buyer || buyer.role !== 'BUYER') {
      throw new NotFoundException(
        `User ${dto.buyerId} was not found or is not a BUYER`,
      );
    }

    // status is NOT in the DTO -> Prisma uses the schema default PENDING.
    const order = await this.prisma.order.create({ data: dto });

    // PHASE 4: the RabbitMQ publisher call will go right here,
    // after the order is safely in the database.

    return order;
  }

  // SELECT * FROM "Order" (+ the buyer of each order)
  findAll() {
    return this.prisma.order.findMany({
      include: { buyer: true },
    });
  }

  // SELECT * FROM "Order" WHERE buyerId = ?
  // Feature: "buyer can view their orders"
  findByBuyer(buyerId: number) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: { buyer: true },
    });
  }

  // SELECT * FROM "Order" WHERE id = ?
  findOne(id: number) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  // Change status PENDING -> CONFIRMED.
  // Teaches: an UPDATE query + a state transition rule.
  async confirm(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    // Business rule: only PENDING orders can be confirmed.
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Order ${id} is already ${order.status}; only PENDING orders can be confirmed`,
      );
    }

    // UPDATE "Order" SET status = 'CONFIRMED' WHERE id = ?
    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CONFIRMED },
    });
  }
}
