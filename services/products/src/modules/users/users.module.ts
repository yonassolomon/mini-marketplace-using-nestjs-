// ============================================================
// users.module.ts — registers the Users module
//
// 1. Purpose: groups UsersController + UsersService and imports
//    PrismaModule (because UsersService needs the database).
// 2. Called by: AppModule (imports UsersModule).
// 3. Calls: imports PrismaModule.
// 4. Communication: Dependency Injection.
// 5. Why it exists: NestJS only knows about classes that are
//    declared inside a module. This file is the "registration
//    desk" for everything users-related.
// ============================================================

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule], // so PrismaService can be injected here
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
