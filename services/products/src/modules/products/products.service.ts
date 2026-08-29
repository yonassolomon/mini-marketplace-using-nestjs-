// ============================================================
// products.service.ts — the business logic for products
//
// 1. Purpose: creates and reads products, and enforces the
//    business rule "only a SELLER can create a product".
// 2. Called by: ProductsController (function call via DI).
// 3. Calls: PrismaService (this.prisma.user / this.prisma.product).
// 4. Communication: Dependency Injection + Database query.
// 5. Why it exists: this is where the REAL rules of the domain
//    live. The controller has no idea that a seller check
//    happens — it just asks the service for a result.
// ============================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a product ONLY if the seller exists and is a SELLER.
  // This is a business rule -> it lives in the service, not the DTO.
  async create(dto: CreateProductDto) {
    // SELECT * FROM "User" WHERE id = ?
    const seller = await this.prisma.user.findUnique({
      where: { id: dto.sellerId },
    });

    if (!seller || seller.role !== 'SELLER') {
      // throws -> NestJS answers with HTTP 404 + this message
      throw new NotFoundException(
        `User ${dto.sellerId} was not found or is not a SELLER`,
      );
    }

    // INSERT INTO "Product" (sellerId, name, price) VALUES (...)
    return this.prisma.product.create({ data: dto });
  }

  // SELECT * FROM "Product"  (+ the seller of each product)
  findAll() {
    return this.prisma.product.findMany({
      include: { seller: true }, // join with User table
    });
  }

  // SELECT * FROM "Product" WHERE sellerId = ?
  // Feature: "seller can view THEIR products"
  findBySeller(sellerId: number) {
    return this.prisma.product.findMany({
      where: { sellerId },
      include: { seller: true },
    });
  }

  // SELECT * FROM "Product" WHERE id = ?
  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }
}
