import { Elysia } from "elysia";
import webSocketsRoute from './webSockets';

const args = process.argv;
const portIndex = args.indexOf("--port");
const port = (portIndex !== -1 && args.length > portIndex + 1) 
  ? Number(args[portIndex + 1]) : 3000;
  
const app = new Elysia()
  .use(webSocketsRoute)
  .get("/", () => "Hello Elysia")
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
