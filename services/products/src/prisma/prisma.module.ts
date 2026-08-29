// ============================================================
// prisma.module.ts — registers PrismaService as shareable
//
// 1. Purpose: declares PrismaService as a provider and EXPORTS
//    it so other modules can inject it.
// 2. Called by: AppModule (imports PrismaModule).
// 3. Calls: nothing itself; it just registers PrismaService.
// 4. Communication: Dependency Injection.
// 5. Why it exists: providers are private to a module by
//    default. Without `exports`, UsersModule could not inject
//    PrismaService. Exporting is how NestJS shares services
//    between modules.
// ============================================================

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService], // NestJS creates this instance
  exports: [PrismaService], // and hands it to any module that imports us
})
export class PrismaModule {}
