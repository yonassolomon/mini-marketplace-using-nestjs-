// ============================================================
// orders.service.ts — the gateway's client for the ORDER service
//
// 1. Purpose: makes HTTP calls TO the Order Service.
// 2. Called by: OrdersController (function call via DI).
// 3. Calls: http://ORDER_SERVICE_URL via @nestjs/axios (HTTP).
// 4. Communication: HTTP (outgoing, to Order Service on 3002).
// 5. Why it exists: identical role to ProductsService — the
//    gateway is a pure telephone operator: it forwards, never
//    decides. The Order Service's RabbitMQ publish (Phase 4)
//    stays invisible to the gateway.
//    Same rxjs pattern as ProductsService: pipe(map()) to
//    extract the body, firstValueFrom() to await the result.
// ============================================================

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OrdersService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.baseUrl = config.get<string>(
      'ORDER_SERVICE_URL',
      'http://localhost:3002',
    );
  }

  // POST http://orders:3002/orders
  createOrder(dto: unknown) {
    return firstValueFrom(
      this.http
        .post(`${this.baseUrl}/orders`, dto)
        .pipe(map((res) => res.data)),
    );
  }

  // GET http://orders:3002/orders
  findAll() {
    return firstValueFrom(
      this.http.get(`${this.baseUrl}/orders`).pipe(map((res) => res.data)),
    );
  }

  // GET http://orders:3002/orders/buyer/5
  findByBuyer(buyerId: number) {
    return firstValueFrom(
      this.http
        .get(`${this.baseUrl}/orders/buyer/${buyerId}`)
        .pipe(map((res) => res.data)),
    );
  }

  // POST http://orders:3002/orders/5/confirm
  confirm(id: number) {
    return firstValueFrom(
      this.http
        .post(`${this.baseUrl}/orders/${id}/confirm`)
        .pipe(map((res) => res.data)),
    );
  }

  // GET http://orders:3002/orders/5
  findOne(id: number) {
    return firstValueFrom(
      this.http
        .get(`${this.baseUrl}/orders/${id}`)
        .pipe(map((res) => res.data)),
    );
  }
}
