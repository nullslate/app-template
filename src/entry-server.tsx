import {
  createRequestHandler,
  defaultStreamHandler,
} from "@tanstack/react-router/ssr/server"
import { createRouter } from "./router"

export async function fetch(request: Request): Promise<Response> {
  const handler = createRequestHandler({
    createRouter,
    request,
  })
  return handler(defaultStreamHandler)
}
