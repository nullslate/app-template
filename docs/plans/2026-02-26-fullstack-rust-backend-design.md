# Fullstack Rust Backend with Devforge

**Date:** 2026-02-26
**Status:** Approved

## Problem

The app-template is frontend-only (TanStack Start + Nitro SSR). Projects like tileforge need a Rust backend (Axum API) with infrastructure (Postgres), dev orchestration (devforge), and a unified development experience. Currently this setup is manually assembled per project.

## Solution

Add a `fullstack` project type to `create-sandybridge-app` that scaffolds a Cargo workspace wrapping the existing frontend template. Add `ns dev` and `ns build` commands to the CLI as a universal project runner.

## Decisions

- **Project type, not feature flag** — fullstack is a new project type in `ns init`, not a feature on the app template
- **Cargo workspace wrapper** — frontend lives in `web/`, Rust crates in `crates/`, matches tileforge pattern
- **Single API crate** — minimal Axum + SQLx starter; users add more crates as needed
- **PostgreSQL only** — single Postgres container in docker-compose; users add Redis/MinIO as needed
- **SQLx for DB access** — compile-time checked queries, no ORM
- **xtask convention** — local `xtask` crate wraps `devforge::run()`, cargo alias `xtask`
- **`ns` as universal runner** — detects project type and dispatches dev/build commands

## Scaffolded Project Structure

```
my-project/
├── Cargo.toml              # workspace: ["crates/*", "xtask"]
├── .cargo/config.toml      # alias: xtask = "run --package xtask --"
├── devforge.toml            # dev environment orchestration
├── docker-compose.yml       # Postgres
├── mprocs.yaml              # api + web dev servers
├── .env.example
├── .env                     # generated from .env.example
├── .gitignore               # Rust + Node
├── crates/
│   └── api/
│       ├── Cargo.toml       # axum, tokio, sqlx, serde, tower-http, tracing
│       ├── src/
│       │   ├── main.rs      # Axum server: config, pool, routes, serve
│       │   ├── config.rs    # AppConfig from env
│       │   ├── state.rs     # AppState { db: PgPool }
│       │   └── error.rs     # ApiError enum → HTTP responses
│       └── migrations/      # empty — user adds their own
├── xtask/
│   ├── Cargo.toml           # depends on devforge crate
│   └── src/main.rs          # devforge::run()
└── web/                     # existing app-template content
    ├── package.json
    ├── vite.config.ts
    ├── src/
    └── ...
```

## Template Location

New `fullstack/` directory inside the app-template repo:

```
app-template/
├── src/                     # existing frontend (unchanged)
├── template.json            # existing app features (unchanged)
├── fullstack/
│   ├── template.json        # fullstack-specific features + variables
│   ├── Cargo.toml
│   ├── .cargo/config.toml
│   ├── devforge.toml
│   ├── docker-compose.yml
│   ├── mprocs.yaml
│   ├── .env.example
│   ├── .gitignore
│   ├── crates/api/Cargo.toml
│   ├── crates/api/src/main.rs
│   ├── crates/api/src/config.rs
│   ├── crates/api/src/state.rs
│   ├── crates/api/src/error.rs
│   ├── crates/api/migrations/.gitkeep
│   ├── xtask/Cargo.toml
│   └── xtask/src/main.rs
```

## API Template Details

### Dependencies (crates/api/Cargo.toml)

```toml
[package]
name = "{{project_name}}-api"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = "0.8"
tokio = { version = "1", features = ["full"] }
sqlx = { version = "0.8", features = ["runtime-tokio", "postgres", "migrate"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tower-http = { version = "0.6", features = ["cors", "trace"] }
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
```

### main.rs — Minimal Axum Server

- Load `AppConfig` from env vars (`DATABASE_URL`, `PORT`)
- Create SQLx `PgPool` with `max_connections = 10`
- Run `sqlx::migrate!()` on startup
- Build router: `GET /health` returns `{"status": "ok"}`
- Apply CORS middleware (configurable via `CORS_ORIGIN`)
- Apply tracing middleware
- Serve on `0.0.0.0:{PORT}` (default 8080)

### config.rs — AppConfig

```rust
pub struct AppConfig {
    pub database_url: String,
    pub port: u16,
    pub cors_origin: Option<String>,
}
```

Loaded from env vars. Panics on missing `DATABASE_URL`.

### state.rs — AppState

```rust
#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
}
```

### error.rs — ApiError

Minimal enum: `NotFound`, `BadRequest(String)`, `Internal(String)`.
Implements `IntoResponse` returning JSON `{"error": "message"}`.

## Infrastructure Files

### docker-compose.yml

Single Postgres 17 service on port 5433 (avoids conflict with host Postgres).
DB name, user, password all set to `{{project_name}}`. Volume for data persistence.

### devforge.toml

```toml
env_files = [".env"]
required_tools = ["docker", "cargo", "bun", "mprocs"]

[docker]
compose_file = "docker-compose.yml"

[[docker.health_checks]]
name = "postgres"
cmd = ["docker", "compose", "exec", "-T", "postgres", "pg_isready", "-U", "{{project_name}}"]
timeout = 30

[dev]
mprocs_config = "mprocs.yaml"

[[dev.hooks]]
cmd = "bun install"
cwd = "web"

[dev.hooks.condition]
missing = "web/node_modules"
```

### mprocs.yaml

Two processes: `api` (cargo run) and `web` (bun dev in web/).

### .env.example

```env
DATABASE_URL=postgresql://{{project_name}}:{{project_name}}@127.0.0.1:5433/{{project_name}}
PORT=8080
CORS_ORIGIN=http://localhost:3000
```

## `ns` CLI Changes (nullslate-cli)

### New Commands

```
ns init <name>           # existing — add Fullstack to ProjectType
ns dev                   # NEW — universal dev runner
ns build                 # NEW — universal build runner
```

### Project Detection (for ns dev / ns build)

Walk up from CWD to find project root. Detection order:

1. `devforge.toml` exists → **fullstack** project
2. `package.json` exists (no devforge.toml) → **frontend-only** project
3. `Cargo.toml` exists (no devforge.toml, no package.json) → **Rust-only** project
4. None found → error

### Command Dispatch

| Command    | Fullstack (devforge.toml)          | Frontend (package.json)  | Rust (Cargo.toml)        |
|------------|-------------------------------------|--------------------------|--------------------------|
| `ns dev`   | `cargo xtask dev`                  | `bun dev`                | `cargo run`              |
| `ns build` | `cargo build --release` in root + `bun run build` in web/ | `bun run build` | `cargo build --release` |

### Scaffolding Flow (ns init --fullstack)

1. Clone app-template to temp dir
2. Copy frontend files to `{output}/web/` (apply existing feature flags: auth, docs, db)
3. Copy `fullstack/` files to `{output}/` root
4. Replace `{{project_name}}` in all fullstack template files
5. Generate `.env` from `.env.example`
6. Run `bun install` in `web/`
7. Init git

## Frontend ↔ Backend Integration

The web app communicates with the Rust API via `API_URL` env var:
- Dev: `http://localhost:8080` (mprocs runs both)
- Prod: configured per deployment

The frontend's `web/.env.local` gets `VITE_API_URL=http://localhost:8080` for dev.

## What This Does NOT Include

- Auth on the Rust side (no JWT, no middleware) — user adds per project
- Database schema / migrations — empty migrations/ dir, user creates their own
- Redis, NATS, S3, or any services beyond Postgres
- Worker crates, CLI crates, or WASM crates
- OpenAPI / Swagger — user adds if needed

The template is intentionally minimal. It provides the infrastructure and patterns; users build on top.
