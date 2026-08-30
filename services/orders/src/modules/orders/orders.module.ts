// ============================================================
// orders.module.ts — registers the Orders module
//
// 1. Purpose: groups OrdersController + OrdersService, imports
//    PrismaModule for database access.
// 2. Called by: AppModule.
// 3. Calls: imports PrismaModule.
// 4. Communication: Dependency Injection.
// 5. Why it exists: registration desk. In Phase 4 this module
//    will also import a RabbitMQ module so OrdersService can
//    publish events.
// ============================================================

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
