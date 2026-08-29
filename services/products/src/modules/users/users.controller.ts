// ============================================================
// users.controller.ts — the HTTP door for /users routes
//
// 1. Purpose: receives HTTP requests for /users and translates
//    them into UsersService method calls.
// 2. Called by: NestJS HTTP layer (a client sends
//    POST/GET http://localhost:3001/users).
// 3. Calls: UsersService (function call via DI).
// 4. Communication: HTTP in -> function call out.
// 5. Why it exists: controllers are "receptionists". They map
//    routes (@Post/@Get), extract the request (@Body, @Param)
//    and return whatever the service gives them. NO business
//    logic allowed here.
// ============================================================

import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // all routes in here start with /users
export class UsersController {
  // DI: the same UsersService instance the module registered
  constructor(private readonly usersService: UsersService) {}

  // POST /users  -> body must match CreateUserDto (validated)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // GET /users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/5  -> ParseIntPipe converts "5" to number 5
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
