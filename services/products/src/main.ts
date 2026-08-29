// ============================================================
// main.ts — the entry point of the Product Service
//
// 1. Purpose: boots the whole NestJS application and starts
//    listening for HTTP requests on port 3001.
// 2. Called by: node dist/main (after `npm run build`).
// 3. Calls: NestFactory.create(AppModule) and app.listen().
// 4. Communication: starts the HTTP server (incoming HTTP).
// 5. Why it exists: every process needs a start button. This
//    file is the start button of this microservice. Global
//    settings (validation, prefix, CORS) are configured here.
// ============================================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // NestFactory creates the whole application from AppModule.
  // AppModule is the root module that imports everything else.
  const app = await NestFactory.create(AppModule);

  // Global ValidationPipe: every DTO (create-product.dto.ts etc.)
  // is validated automatically before it reaches a controller.
  // whitelist: true  -> strips properties that are NOT in the DTO
  // transform: true  -> converts JSON values into typed objects
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  // PORT comes from .env (ConfigModule loads it into process.env).
  const port = process.env.PORT ?? 3001;
  console.log(`[ProductService] listening on http://localhost:${port}`);
  await app.listen(port);
}

bootstrap();
