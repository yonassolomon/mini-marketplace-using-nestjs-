// ============================================================
// products.module.ts — registers the gateway's Products module
//
// 1. Purpose: groups the controller + service and imports the
//    HTTP client module (HttpModule from @nestjs/axios) so the
//    service can make HTTP calls to the Product Service.
// 2. Called by: AppModule.
// 3. Calls: imports HttpModule.
// 4. Communication: Dependency Injection.
// 5. Why it exists: HttpModule provides HttpService (axios
//    wrapped for NestJS). The timeout is a good default so the
//    gateway fails fast if the Product Service is down.
// ============================================================

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
