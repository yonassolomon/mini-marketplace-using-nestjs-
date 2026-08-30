// ============================================================
// order-created.event.ts — the SHAPE of the message we publish
//
// 1. Purpose: defines what an `order.created` message contains.
// 2. Called by: OrdersService (it creates one after each order).
// 3. Calls: nothing.
// 4. Communication: the class instance is serialized to JSON and
//    sent through RabbitMQ (no direct connection between
//    publisher and consumer).
// 5. Why it exists: a message is just a JSON blob. The class
//    documents its contract and gives type safety on the
//    publishing side. The Notification Service defines its OWN
//    copy of this class (services never share code — same
//    reason they never share databases).
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
