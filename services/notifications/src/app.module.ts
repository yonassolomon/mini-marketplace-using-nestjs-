// ============================================================
// app.module.ts — root module of the Notification Service
//
// 1. Purpose: declares the modules of this service. Notice what
//    is MISSING: no Prisma, no database at all. This service's
//    only input is the message queue.
// 2. Called by: main.ts.
// 3. Calls: imports ConfigModule + NotificationsModule.
// 4. Communication: Dependency Injection.
// 5. Why it exists: minimalism is a feature here — it shows that
//    a consumer service can be tiny: it exists only to react
//    to events. (A real notification service would add a DB to
//    persist notifications; we keep it in memory for learning.)
// ============================================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NotificationsModule,
  ],
})
export class AppModule {}
