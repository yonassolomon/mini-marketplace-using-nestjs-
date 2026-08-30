// ============================================================
// app.module.ts — root module of the API Gateway
//
// 1. Purpose: declares the gateway's modules. Only two feature
//    modules — products and orders — because the gateway only
//    knows how to FORWARD to those two services.
// 2. Called by: main.ts.
// 3. Calls: imports ConfigModule, ProductsModule, OrdersModule.
// 4. Communication: Dependency Injection.
// 5. Why it exists: same root-module pattern as every service.
//    Notice what is MISSING: no Prisma, no RabbitMQ. The
//    gateway owns no data and produces no events — it only
//    routes HTTP.
// ============================================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
