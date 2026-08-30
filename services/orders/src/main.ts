// ============================================================
// main.ts — the entry point of the Order Service
//
// 1. Purpose: boots the NestJS application on port 3002.
// 2. Called by: node dist/main.
// 3. Calls: NestFactory.create(AppModule), app.listen().
// 4. Communication: starts the HTTP server (incoming HTTP).
// 5. Why it exists: identical job to the Product Service's
//    main.ts — every microservice is its own program with its
//    own start button. In Phase 4 this service ALSO becomes a
//    RabbitMQ publisher (a second "communication channel").
// ============================================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Same global validation as the Product Service.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT ?? 3002;
  console.log(`[OrderService] listening on http://localhost:${port}`);
  await app.listen(port);
}

bootstrap();
