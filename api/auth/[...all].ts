import { defineHandler } from "nitro/h3"
import { handleAuth } from "../../src/lib/auth"

export default defineHandler(async (event) => {
  return handleAuth(event.req)
})
