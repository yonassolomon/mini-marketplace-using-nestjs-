// ============================================================
// notifications.service.ts — what happens when an event arrives
//
// 1. Purpose: processes consumed events: builds a human-readable
//    message, logs it, and keeps it in memory.
// 2. Called by: NotificationsController.handleOrderCreated()
//    (function call via DI).
// 3. Calls: nothing (console + an in-memory array).
// 4. Communication: function call only — this is the END of the
//    async chain. No more calls happen after this.
// 5. Why it exists: the "reaction" to the event. The publisher
//    does not know this code exists — that is the power of async:
//    we can change how notifications are handled (e.g. email,
//    SMS, a database) WITHOUT touching the Order Service.
// ============================================================

import { Injectable } from '@nestjs/common';
import { OrderCreatedEvent } from './order-created.event';

@Injectable()
export class NotificationsService {
  // in-memory list of notifications (a real service would use a DB)
  private readonly notifications: string[] = [];

  handleOrderCreated(event: OrderCreatedEvent) {
    const message =
      `Order #${event.orderId} placed by ${event.buyerName} ` +
      `(buyer ${event.buyerId}): ${event.quantity}x product ` +
      `${event.productId}. Status: ${event.status}`;

    console.log(`[NotificationService] ${message}`);
    this.notifications.push(message);

    // returned value is ignored by NestJS for events (no reply)
    return { received: true, message };
  }

  // HTTP helper: show all notifications consumed so far
  findAll() {
    return this.notifications;
  }
}
