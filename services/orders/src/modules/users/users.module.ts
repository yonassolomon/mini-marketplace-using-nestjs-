// ============================================================
// users.module.ts — registers the Users module
//
// 1. Purpose: groups UsersController + UsersService, imports
//    PrismaModule for database access.
// 2. Called by: AppModule.
// 3. Calls: imports PrismaModule.
// 4. Communication: Dependency Injection.
// 5. Why it exists: registration desk (same as Product Service).
// ============================================================

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
