// ============================================================
// users.controller.ts — the HTTP door for /users routes
//
// 1. Purpose: receives HTTP requests for /users.
// 2. Called by: NestJS HTTP layer (client -> port 3002).
// 3. Calls: UsersService.
// 4. Communication: HTTP in -> function call out.
// 5. Why it exists: the receptionist role again — thin, no logic.
// ============================================================

import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
