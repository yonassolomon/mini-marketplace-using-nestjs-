-- Runs automatically when the postgres container is created (first boot only).
-- Creates the two databases our microservices own (DB per service).
CREATE DATABASE marketplace_products;
CREATE DATABASE marketplace_orders;
