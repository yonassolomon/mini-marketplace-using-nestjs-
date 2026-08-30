// ============================================================
// notifications.controller.ts — the CONSUMER's front door
//
// 1. Purpose: receives RabbitMQ messages and translates them
//    into NotificationsService calls. ALSO serves the HTTP
//    GET /notifications viewer route.
// 2. Called by: the RabbitMQ transport (NestJS's server-rmq
//    delivers queue messages here and matches @EventPattern).
//    The HTTP route is called by a client on port 3003.
// 3. Calls: NotificationsService (function call via DI).
// 4. Communication: RabbitMQ in (@EventPattern) + HTTP in (@Get)
//    -> function call out.
// 5. Why it exists: the KEY new concept — @EventPattern is the
//    async counterpart of @Post/@Get. A normal controller listens
//    for HTTP verbs; this one listens for a message PATTERN
//    ('order.created'). When the publisher emits that pattern,
//    this method runs with the deserialized event as payload.
// ============================================================

import { Controller, Get } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { OrderCreatedEvent } from './order-created.event';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // RabbitMQ consumer: runs when a message with pattern
  // 'order.created' arrives from the orders_queue.
  @EventPattern('order.created')
  handleOrderCreated(data: OrderCreatedEvent) {
    return this.notificationsService.handleOrderCreated(data);
  }

  // HTTP helper to VIEW the consumed notifications (curl).
  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }
}
