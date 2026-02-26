import { Auth } from "@auth/core"
import GitHub from "@auth/core/providers/github"
import type { AuthConfig } from "@auth/core/types"

const config: AuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  basePath: "/api/auth",
}

export async function handleAuth(request: Request): Promise<Response> {
  return Auth(request, config)
}
