// ============================================================
// orders.module.ts — registers the gateway's Orders module
//
// 1. Purpose: groups the controller + service, imports HttpModule.
// 2. Called by: AppModule.
// 3. Calls: imports HttpModule.
// 4. Communication: Dependency Injection.
// 5. Why it exists: registration desk, same as ProductsModule.
// ============================================================

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
