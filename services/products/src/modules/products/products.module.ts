// ============================================================
// products.module.ts — registers the Products module
//
// 1. Purpose: groups ProductsController + ProductsService and
//    imports PrismaModule for database access.
// 2. Called by: AppModule.
// 3. Calls: imports PrismaModule.
// 4. Communication: Dependency Injection.
// 5. Why it exists: registration desk for products-related parts.
// ============================================================

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
