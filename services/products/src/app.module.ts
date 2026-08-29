// ============================================================
// app.module.ts — the root module of the Product Service
//
// 1. Purpose: the "company headquarters". Declares which modules
//    make up this service and loads environment variables.
// 2. Called by: main.ts (NestFactory.create(AppModule)).
// 3. Calls: imports ConfigModule, PrismaModule, UsersModule,
//    ProductsModule.
// 4. Communication: Dependency Injection — NestJS reads this
//    module to build the dependency tree of the whole app.
// 5. Why it exists: NestJS is modular. The root module is the
//    single entry that knows ALL parts of the service.
// ============================================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    // Loads .env into process.env so PORT / DATABASE_URL work.
    // isGlobal: true -> available everywhere without re-importing.
    ConfigModule.forRoot({ isGlobal: true }),
    // Database access layer (shared by all modules).
    PrismaModule,
    // Business modules.
    UsersModule,
    ProductsModule,
  ],
})
export class AppModule {}
