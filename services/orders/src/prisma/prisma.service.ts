// ============================================================
// prisma.service.ts — wraps the Prisma client for NestJS
//
// 1. Purpose: injectable database access for this service.
// 2. Called by: UsersService and OrdersService via DI.
// 3. Calls: PostgreSQL (marketplace_orders database).
// 4. Communication: Database query + Dependency Injection.
// 5. Why it exists: same as Product Service — manages the
//    connection lifecycle at app start/stop.
// ============================================================

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    console.log('[PrismaService] connected to PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
