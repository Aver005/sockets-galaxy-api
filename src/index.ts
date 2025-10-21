/**
 * @fileoverview Точка входа для Sockets Galaxy API сервера
 * @description WebSocket сервер для интерактивной галактики звёзд на базе Elysia и Bun
 */

import { Elysia } from "elysia";
import webSocketsRoute from './webSockets';

/**
 * Аргументы командной строки для настройки сервера
 */
const args = process.argv;

/**
 * Индекс аргумента --port в командной строке
 */
const portIndex = args.indexOf("--port");

/**
 * Порт для запуска сервера
 * @description Извлекается из аргументов командной строки или используется значение по умолчанию 3000
 */
const port = (portIndex !== -1 && args.length > portIndex + 1) 
  ? Number(args[portIndex + 1]) : 3000;

/**
 * Основное приложение Elysia
 * @description Настраивает WebSocket маршруты и базовый HTTP endpoint
 */
const app = new Elysia()
  .use(webSocketsRoute)
  .get("/", () => "Hello Elysia")
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
