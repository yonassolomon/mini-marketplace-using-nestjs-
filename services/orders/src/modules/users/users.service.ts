// ============================================================
// users.service.ts — business logic for users (buyers)
//
// 1. Purpose: creates and reads users in the orders database.
// 2. Called by: UsersController.
// 3. Calls: PrismaService.
// 4. Communication: Dependency Injection + Database query.
// 5. Why it exists: same pattern as the Product Service. The
//    code is nearly identical — the interesting part is that it
//    runs against a COMPLETELY SEPARATE database. That is the
//    "DB per service" microservices pattern in action.
// ============================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUserDto) {
    return this.prisma.user.create({ data: dto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
