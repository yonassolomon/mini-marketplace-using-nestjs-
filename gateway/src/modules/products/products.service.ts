// ============================================================
// products.service.ts — the gateway's client for the PRODUCT service
//
// 1. Purpose: makes HTTP calls TO the Product Service. This is
//    the SYNCHRONOUS service-to-service communication: the
//    gateway sends a request and WAITS for the answer.
// 2. Called by: ProductsController (function call via DI).
// 3. Calls: http://PRODUCT_SERVICE_URL via @nestjs/axios (HTTP).
// 4. Communication: HTTP (outgoing, to Product Service on 3001).
// 5. Why it exists: the gateway doesn't know how to create a
//    product — it only knows WHO can do it. This file is the
//    "phone number + dialing" of the gateway: it translates a
//    controller call into an HTTP request to the right service
//    and returns the response to the caller.
//
//    IMPORTANT pattern: http.get() returns an rxjs OBSERVABLE,
//    not a Promise. We use pipe(map(...)) to extract the body
//    and firstValueFrom() to turn the Observable into a Promise
//    so the controller can simply `await` the result.
// ============================================================

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductsService {
  // where the Product Service lives (localhost in dev,
  // http://products:3001 inside Docker — see docker-compose)
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.baseUrl = config.get<string>(
      'PRODUCT_SERVICE_URL',
      'http://localhost:3001',
    );
  }

  // POST http://products:3001/products
  createProduct(dto: unknown) {
    return firstValueFrom(
      this.http
        .post(`${this.baseUrl}/products`, dto)
        .pipe(map((res) => res.data)),
    );
  }

  // GET http://products:3001/products
  findAll() {
    return firstValueFrom(
      this.http.get(`${this.baseUrl}/products`).pipe(map((res) => res.data)),
    );
  }

  // GET http://products:3001/products/seller/5
  findBySeller(sellerId: number) {
    return firstValueFrom(
      this.http
        .get(`${this.baseUrl}/products/seller/${sellerId}`)
        .pipe(map((res) => res.data)),
    );
  }

  // GET http://products:3001/products/5
  findOne(id: number) {
    return firstValueFrom(
      this.http
        .get(`${this.baseUrl}/products/${id}`)
        .pipe(map((res) => res.data)),
    );
  }
}
