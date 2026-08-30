// ============================================================
// prisma.module.ts — registers + exports PrismaService
//
// 1. Purpose: makes PrismaService injectable in other modules.
// 2. Called by: AppModule.
// 3. Calls: nothing itself.
// 4. Communication: Dependency Injection.
// 5. Why it exists: without `exports`, other modules cannot
//    inject PrismaService (providers are module-private by
//    default). Same file as in the Product Service.
// ============================================================

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
