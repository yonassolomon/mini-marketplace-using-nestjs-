// ============================================================
// main.ts — the entry point of the API Gateway
//
// 1. Purpose: boots the gateway on port 3000 — the ONLY port
//    the outside world knows about.
// 2. Called by: node dist/main.
// 3. Calls: NestFactory.create(AppModule), app.listen().
// 4. Communication: starts the HTTP server (incoming HTTP from
//    clients — browsers, curl, mobile apps).
// 5. Why it exists: the gateway is a "reception desk". It
//    enables CORS (because browsers talk to IT, not to the
//    internal services) and it hides the internal service
//    topology from clients. It has ZERO business logic — it
//    only forwards requests to the right service.
// ============================================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS belongs HERE, at the edge. The internal services never
  // talk to browsers, so they don't need it. (CORS = the browser
  // rule that lets page on site A call an API on site B.)
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT ?? 3000;
  console.log(`[ApiGateway] listening on http://localhost:${port}`);
  await app.listen(port);
}

bootstrap();
