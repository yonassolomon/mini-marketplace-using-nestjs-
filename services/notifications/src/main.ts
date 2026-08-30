// ============================================================
// main.ts — entry point of the Notification Service (HYBRID app)
//
// 1. Purpose: starts TWO listeners:
//    a) RabbitMQ consumer (the real job) — listens for messages
//       on the 'orders_queue' queue.
//    b) HTTP on port 3003 (a convenience) — so you can curl
//       /notifications and SEE what was consumed.
// 2. Called by: node dist/main.
// 3. Calls: NestFactory.create(AppModule), connectMicroservice(),
//    startAllMicroservices(), listen().
// 4. Communication: RabbitMQ (incoming messages) + HTTP (viewing).
// 5. Why it exists: NestJS calls an app that has BOTH an HTTP
//    server and a message broker listener a HYBRID application.
//    This is the first file where a service's "input" is not
//    HTTP but a QUEUE — the essence of async communication.
//    IMPORTANT: the queue name must match the publisher's
//    ('orders_queue'). That name is the contract between the two.
// ============================================================

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the app (HTTP server comes along with NestFactory.create)
  const app = await NestFactory.create(AppModule);

  // Attach a SECOND type of server: a RabbitMQ consumer.
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672'],
      // THE agreement with the publisher (Order Service)
      queue: 'orders_queue',
      queueOptions: { durable: true },
      // noAck: false (default) = the consumer tells RabbitMQ
      // "I processed this message" (ack). If our handler throws,
      // RabbitMQ redelivers the message — no message is lost.
    },
  });

  // Start the RabbitMQ consumer (subscribes to the queue).
  await app.startAllMicroservices();
  console.log('[NotificationService] RabbitMQ consumer started on orders_queue');

  // Also listen on HTTP so we can inspect consumed notifications.
  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(`[NotificationService] HTTP (viewer) on http://localhost:${port}`);
}

bootstrap();
