// ============================================================
// notifications.module.ts — registers the Notifications module
//
// 1. Purpose: groups the consumer controller + service.
// 2. Called by: AppModule.
// 3. Calls: nothing (no imports needed — no DB, no client proxy).
// 4. Communication: Dependency Injection.
// 5. Why it exists: registration desk. Note there is no Prisma
//    import here — this service has no database at all.
// ============================================================

import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
