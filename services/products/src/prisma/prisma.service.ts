// ============================================================
// prisma.service.ts — wraps the Prisma client for NestJS
//
// 1. Purpose: a wrapper around PrismaClient so NestJS can
//    inject database access into any service via DI.
// 2. Called by: every service (UsersService, ProductsService)
//    through the constructor (dependency injection).
// 3. Calls: PostgreSQL (generates SQL from Prisma queries).
// 4. Communication: Database query + Dependency Injection.
// 5. Why it exists: PrismaClient's connection lifecycle
//    ($connect / $disconnect) should be managed once, at app
//    startup and shutdown. NestJS lifecycle hooks
//    (OnModuleInit / OnModuleDestroy) do exactly that.
// ============================================================

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient // inherit all Prisma query methods (user, product, ...)
  implements OnModuleInit, OnModuleDestroy
{
  // Runs automatically when the app starts -> open the connection.
  async onModuleInit() {
    await this.$connect();
    console.log('[PrismaService] connected to PostgreSQL');
  }

  // Runs automatically when the app shuts down -> close the connection.
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
