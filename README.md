# {{project_name}}

A nullslate project template.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

3. **Set up the database (if using PostgreSQL):**
   ```bash
   # Create the database
   createdb {{project_name}}

   # Update DATABASE_URL in .env
   ```

4. **Configure GitHub OAuth (if using auth):**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - Set the callback URL to `http://localhost:3000/api/auth/callback/github`
   - Copy the Client ID and Client Secret to `.env`

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth.js handlers
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── navbar.tsx         # Navigation bar
│   ├── footer.tsx         # Footer
│   ├── theme-provider.tsx # Theme context
│   └── query-provider.tsx # React Query provider
├── lib/                   # Utility functions
│   └── db.ts              # Database connection
├── auth.ts                # NextAuth.js configuration
├── auth.config.ts         # Auth providers config
└── types/                 # TypeScript type definitions
```

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [@thesandybridge/ui](https://github.com/thesandybridge/ui)
- **Themes:** [@thesandybridge/themes](https://github.com/thesandybridge/themes)
- **Authentication:** [NextAuth.js v5](https://authjs.dev/)
- **Database:** PostgreSQL with [node-postgres](https://node-postgres.com/)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret for NextAuth.js |
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret |
| `JWT_SECRET` | Secret for signing API tokens |

## Deployment

This project is configured for deployment on [Railway](https://railway.app/).

1. Connect your GitHub repository
2. Add the environment variables
3. Deploy

## Created With

[nullslate](https://github.com/nullslate/cli)
