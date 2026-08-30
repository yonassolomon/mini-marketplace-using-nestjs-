// ============================================================
// order-created.event.ts — the consumer's copy of the message shape
//
// 1. Purpose: documents what an `order.created` message contains
//    on the RECEIVING side.
// 2. Called by: NotificationsController (it types the payload).
// 3. Calls: nothing.
// 4. Communication: the class instance arrives deserialized from
//    the RabbitMQ JSON message. No direct link to the publisher.
// 5. Why it exists: the publisher (Order Service) has an IDENTICAL
//    class. We duplicate it on purpose — microservices do not
//    share code, so a message's shape must be documented in both
//    places. The queue name + this shape are the "API contract"
//    of the async link.
// ============================================================

export class OrderCreatedEvent {
  constructor(
    public readonly orderId: number,
    public readonly buyerId: number,
    public readonly buyerName: string,
    public readonly productId: number,
    public readonly quantity: number,
    public readonly status: string,
    public readonly createdAt: Date,
  ) {}
}
