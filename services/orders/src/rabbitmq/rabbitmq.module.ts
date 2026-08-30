// ============================================================
// rabbitmq.module.ts — the PUBLISHER'S connection to RabbitMQ
//
// 1. Purpose: creates and exports a RabbitMQ client proxy that
//    other services can inject to SEND messages.
// 2. Called by: OrdersModule (imports RabbitMQModule).
// 3. Calls: RabbitMQ broker (connects to RABBITMQ_URL).
// 4. Communication: RabbitMQ (outgoing messages) + Dependency
//    Injection (ClientProxy is injected into OrdersService).
// 5. Why it exists: ClientProxyFactory.create() builds NestJS's
//    wrapper around the amqplib connection. Two key options:
//    - queue 'orders_queue': the publisher declares this queue
//      (assertQueue) and pushes messages straight INTO it
//      (sendToQueue). The consumer listens on the SAME name —
//      that is the agreement between them.
//    - queueOptions { durable: true } + persistent: true: the
//      queue AND the messages survive broker restarts.
//      This is what makes async communication safe: if the
//      Notification Service is down, messages wait in the queue.
//    The token 'RABBITMQ_CLIENT' identifies this provider, so
//    OrdersService can inject it with @Inject('RABBITMQ_CLIENT').
// ============================================================

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  providers: [
    {
      // The token OrdersService will use to request this object
      provide: 'RABBITMQ_CLIENT',
      useFactory: (config: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ, // RabbitMQ transport (amqplib under the hood)
          options: {
            // Where the broker lives (from .env, or a local default).
            // NOTE: get<string>() is required — without the explicit
            // generic, @nestjs/config v3 typings break the type check.
            urls: [
              config.get<string>('RABBITMQ_URL') ??
                'amqp://guest:guest@localhost:5672',
            ],
            // THE agreement between publisher and consumer
            queue: 'orders_queue',
            // the queue survives broker restarts
            queueOptions: { durable: true },
            // messages survive broker restarts
            persistent: true,
          },
        }),
      // get the env values from ConfigService
      inject: [ConfigService],
    },
  ],
  // export so OrdersService can inject it
  exports: ['RABBITMQ_CLIENT'],
})
export class RabbitMQModule {}
