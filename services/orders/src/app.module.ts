// ============================================================
// app.module.ts — root module of the Order Service
//
// 1. Purpose: declares every module of this service.
// 2. Called by: main.ts.
// 3. Calls: imports ConfigModule, PrismaModule, UsersModule,
//    OrdersModule.
// 4. Communication: Dependency Injection.
// 5. Why it exists: same pattern as Product Service. In Phase 4
//    we will add RabbitMQ-related modules here.
// ============================================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    OrdersModule,
  ],
})
export class AppModule {}
