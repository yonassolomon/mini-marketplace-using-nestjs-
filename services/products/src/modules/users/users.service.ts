// ============================================================
// users.service.ts — the business logic for users
//
// 1. Purpose: creates and reads users in the database.
// 2. Called by: UsersController (function call via DI).
// 3. Calls: PrismaService (this.prisma.user.create / findMany...).
// 4. Communication: Dependency Injection (constructor) +
//    Database query (Prisma -> PostgreSQL).
// 5. Why it exists: business logic lives in services, never in
//    controllers. If tomorrow we add "users can't be created on
//    Sundays", it goes here without touching the HTTP layer.
// ============================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  // NestJS injects the PrismaService instance here (DI).
  // We never call `new` — NestJS owns the lifecycle.
  constructor(private readonly prisma: PrismaService) {}

  // INSERT INTO "User" (name, role) VALUES (...)
  create(dto: CreateUserDto) {
    return this.prisma.user.create({ data: dto });
  }

  // SELECT * FROM "User"  (we display users for the client too)
  findAll() {
    return this.prisma.user.findMany();
  }

  // SELECT * FROM "User" WHERE id = ?
  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
