# Fullstack Rust Backend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a fullstack project type to the nullslate ecosystem — template files in app-template, scaffolding + runner commands in nullslate-cli.

**Architecture:** The app-template repo gets a `fullstack/` directory with Cargo workspace wrapper files (Axum API, xtask, devforge.toml, docker-compose, mprocs). The nullslate-cli gets a `Fullstack` project type for `ns init` plus `ns dev` and `ns build` as universal project runner commands that detect project type by config files.

**Tech Stack:** Rust (Axum, SQLx, tokio), devforge for orchestration, TanStack Start frontend in web/, PostgreSQL via docker-compose.

**Repos:**
- App template: `~/Dev/projects/libs/app-template/`
- CLI: `~/Dev/projects/libs/create-sandybridge-app/`

---

## Phase 1: Fullstack Template Files (app-template repo)

Working directory: `~/Dev/projects/libs/app-template/`

### Task 1: Create fullstack template.json

**Files:**
- Create: `fullstack/template.json`

**Step 1: Create the fullstack template config**

```json
{
  "name": "nullslate-fullstack-template",
  "version": "1.0.0",
  "variables": {
    "project_name": {
      "description": "Name of the project",
      "required": true
    }
  },
  "features": {
    "docs": {
      "description": "Include MDX documentation system",
      "default": false
    },
    "auth": {
      "description": "Include Auth.js authentication (frontend)",
      "default": true
    }
  }
}
```

Note: `db` feature flag is removed from the frontend — the Rust API handles the database via SQLx.

**Step 2: Verify file exists**

```bash
cat fullstack/template.json
```

**Step 3: Commit**

```bash
git add fullstack/template.json
git commit -m "feat: add fullstack template.json"
```

---

### Task 2: Create Cargo workspace root files

**Files:**
- Create: `fullstack/Cargo.toml`
- Create: `fullstack/.cargo/config.toml`
- Create: `fullstack/.gitignore`

**Step 1: Create workspace Cargo.toml**

`fullstack/Cargo.toml`:
```toml
[workspace]
members = ["crates/*", "xtask"]
resolver = "2"
```

**Step 2: Create cargo alias**

`fullstack/.cargo/config.toml`:
```toml
[alias]
xtask = "run --package xtask --"
```

**Step 3: Create .gitignore**

`fullstack/.gitignore`:
```
/target

# dependencies
node_modules

# env files
.env
.env*.local

# build output
.nitro/
.output/
/build

# misc
.DS_Store
*.pem
bun.lock
package-lock.json
*.tsbuildinfo
```

**Step 4: Verify files**

```bash
ls -la fullstack/ fullstack/.cargo/
```

**Step 5: Commit**

```bash
git add fullstack/Cargo.toml fullstack/.cargo/config.toml fullstack/.gitignore
git commit -m "feat: add cargo workspace root files"
```

---

### Task 3: Create xtask crate

**Files:**
- Create: `fullstack/xtask/Cargo.toml`
- Create: `fullstack/xtask/src/main.rs`

**Step 1: Create xtask Cargo.toml**

`fullstack/xtask/Cargo.toml`:
```toml
[package]
name = "xtask"
version = "0.1.0"
edition = "2021"
publish = false

[dependencies]
devforge = "0.1"
```

**Step 2: Create xtask main.rs**

`fullstack/xtask/src/main.rs`:
```rust
fn main() {
    devforge::run();
}
```

**Step 3: Commit**

```bash
git add fullstack/xtask/
git commit -m "feat: add xtask crate wrapping devforge"
```

---

### Task 4: Create API crate — Cargo.toml and error.rs

**Files:**
- Create: `fullstack/crates/api/Cargo.toml`
- Create: `fullstack/crates/api/src/error.rs`
- Create: `fullstack/crates/api/migrations/.gitkeep`

**Step 1: Create API Cargo.toml**

`fullstack/crates/api/Cargo.toml`:
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

**Step 2: Create error.rs**

`fullstack/crates/api/src/error.rs`:
```rust
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;

pub enum ApiError {
    NotFound,
    BadRequest(String),
    Internal(String),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            ApiError::NotFound => (StatusCode::NOT_FOUND, "not found".to_string()),
            ApiError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg),
            ApiError::Internal(msg) => {
                tracing::error!("internal error: {msg}");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal error".to_string())
            }
        };
        (status, Json(serde_json::json!({ "error": message }))).into_response()
    }
}
```

**Step 3: Create empty migrations dir**

```bash
mkdir -p fullstack/crates/api/migrations
touch fullstack/crates/api/migrations/.gitkeep
```

**Step 4: Commit**

```bash
git add fullstack/crates/api/Cargo.toml fullstack/crates/api/src/error.rs fullstack/crates/api/migrations/
git commit -m "feat: add api crate skeleton with error types"
```

---

### Task 5: Create API crate — config.rs and state.rs

**Files:**
- Create: `fullstack/crates/api/src/config.rs`
- Create: `fullstack/crates/api/src/state.rs`

**Step 1: Create config.rs**

`fullstack/crates/api/src/config.rs`:
```rust
pub struct AppConfig {
    pub database_url: String,
    pub port: u16,
    pub cors_origin: Option<String>,
}

impl AppConfig {
    pub fn from_env() -> Self {
        Self {
            database_url: std::env::var("DATABASE_URL")
                .expect("DATABASE_URL must be set"),
            port: std::env::var("PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(8080),
            cors_origin: std::env::var("CORS_ORIGIN").ok(),
        }
    }
}
```

**Step 2: Create state.rs**

`fullstack/crates/api/src/state.rs`:
```rust
use sqlx::PgPool;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
}
```

**Step 3: Commit**

```bash
git add fullstack/crates/api/src/config.rs fullstack/crates/api/src/state.rs
git commit -m "feat: add api config and state"
```

---

### Task 6: Create API crate — main.rs

**Files:**
- Create: `fullstack/crates/api/src/main.rs`

**Step 1: Create main.rs**

`fullstack/crates/api/src/main.rs`:
```rust
mod config;
mod error;
mod state;

use axum::{Json, Router, routing::get};
use sqlx::postgres::PgPoolOptions;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

use config::AppConfig;
use state::AppState;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .init();

    let config = AppConfig::from_env();

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await
        .expect("failed to connect to database");

    sqlx::migrate!()
        .run(&pool)
        .await
        .expect("failed to run migrations");

    let state = AppState { db: pool };

    let cors = match &config.cors_origin {
        Some(origin) => CorsLayer::new()
            .allow_origin(origin.parse::<axum::http::HeaderValue>().unwrap())
            .allow_methods(Any)
            .allow_headers(Any),
        None => CorsLayer::permissive(),
    };

    let app = Router::new()
        .route("/health", get(health))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    let addr = format!("0.0.0.0:{}", config.port);
    tracing::info!("listening on {addr}");
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "status": "ok" }))
}
```

**Step 2: Commit**

```bash
git add fullstack/crates/api/src/main.rs
git commit -m "feat: add api main.rs with axum server"
```

---

### Task 7: Create devforge.toml, docker-compose.yml, mprocs.yaml, .env.example

**Files:**
- Create: `fullstack/devforge.toml`
- Create: `fullstack/docker-compose.yml`
- Create: `fullstack/mprocs.yaml`
- Create: `fullstack/.env.example`

**Step 1: Create devforge.toml**

`fullstack/devforge.toml`:
```toml
env_files = [
    { path = ".env", template = ".env.example" },
]
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

**Step 2: Create docker-compose.yml**

`fullstack/docker-compose.yml`:
```yaml
services:
  postgres:
    image: postgres:17
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: "{{project_name}}"
      POSTGRES_USER: "{{project_name}}"
      POSTGRES_PASSWORD: "{{project_name}}"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

**Step 3: Create mprocs.yaml**

`fullstack/mprocs.yaml`:
```yaml
procs:
  api:
    shell: "cargo run --package {{project_name}}-api"
  web:
    shell: "cd web && bun dev"
```

**Step 4: Create .env.example**

`fullstack/.env.example`:
```env
DATABASE_URL=postgresql://{{project_name}}:{{project_name}}@127.0.0.1:5433/{{project_name}}
PORT=8080
CORS_ORIGIN=http://localhost:3000
```

**Step 5: Commit**

```bash
git add fullstack/devforge.toml fullstack/docker-compose.yml fullstack/mprocs.yaml fullstack/.env.example
git commit -m "feat: add devforge, docker-compose, mprocs, and env template"
```

---

## Phase 2: CLI Changes (create-sandybridge-app repo)

Working directory: `~/Dev/projects/libs/create-sandybridge-app/`

### Task 8: Add Fullstack to ProjectType enum and UI prompts

**Files:**
- Modify: `src/ui.rs`

**Step 1: Add Fullstack variant to ProjectType**

In `src/ui.rs`, add `Fullstack` to the `ProjectType` enum:

```rust
#[derive(Clone, PartialEq, Eq, Debug)]
pub enum ProjectType {
    App,
    Fullstack,
    Lib,
}
```

**Step 2: Update prompt_project_type**

```rust
pub fn prompt_project_type() -> Result<ProjectType> {
    let project_type: ProjectType = cliclack::select("What are you building?")
        .item(ProjectType::App, "Application", "TanStack Start frontend app")
        .item(ProjectType::Fullstack, "Fullstack", "Rust API + TanStack Start frontend with devforge")
        .item(ProjectType::Lib, "Library", "Publishable package (Vite lib mode + tsup)")
        .interact()?;
    Ok(project_type)
}
```

**Step 3: Add outro_success_fullstack function**

```rust
pub fn outro_success_fullstack(project_name: &str, output_path: &std::path::Path) {
    let msg = format!(
        "Created {} at {}\n\n  Next steps:\n    cd {}\n    ns dev",
        project_name,
        output_path.display(),
        project_name,
    );
    let _ = cliclack::outro(msg);
}
```

**Step 4: Run tests**

```bash
cargo test
```

Expected: existing tests still pass (new code is additive).

**Step 5: Commit**

```bash
git add src/ui.rs
git commit -m "feat: add Fullstack project type to UI"
```

---

### Task 9: Add CLI args for fullstack

**Files:**
- Modify: `src/cli.rs`

**Step 1: Add fullstack template URL constant and CLI flag**

In `src/cli.rs`, add the fullstack template URL. Since fullstack uses the same repo but different subdirectory, point to the same app-template URL. Also add a `--fullstack` shorthand flag to `InitArgs`.

Add constant:
```rust
const DEFAULT_FULLSTACK_TEMPLATE_REPO: &str = "https://github.com/nullslate/app-template.git";
```

Update `default_template_url` to accept project type more broadly. Replace the function:

```rust
pub fn default_template_url(project_type: &str) -> &'static str {
    match project_type {
        "lib" => DEFAULT_LIB_TEMPLATE_REPO,
        "fullstack" => DEFAULT_FULLSTACK_TEMPLATE_REPO,
        _ => DEFAULT_TEMPLATE_REPO,
    }
}
```

Add `--fullstack` to `InitArgs`:
```rust
    /// Shorthand for --project-type fullstack
    #[arg(long)]
    pub fullstack: bool,
```

**Step 2: Verify it compiles**

```bash
cargo build
```

Expected: compile errors in `main.rs` where `default_template_url` is called (signature changed). We'll fix in the next task.

**Step 3: Commit (WIP — will fix callers next)**

```bash
git add src/cli.rs
git commit -m "feat: add fullstack template URL and CLI flag"
```

---

### Task 10: Add fullstack scaffolding logic

**Files:**
- Create: `src/fullstack.rs`

**Step 1: Create the fullstack module**

`src/fullstack.rs`:
```rust
use anyhow::Result;
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

use crate::features::{should_skip_file, get_files_to_skip, update_package_json, cleanup_layout_for_no_auth, generate_env_file};
use crate::template::process_template;

const FULLSTACK_SUBDIR: &str = "fullstack";

/// Scaffold a fullstack project:
/// 1. Copy frontend files to {output}/web/
/// 2. Copy fullstack overlay files to {output}/
pub fn scaffold_fullstack(
    temp_path: &Path,
    output_path: &Path,
    project_name: &str,
    include_auth: bool,
    include_docs: bool,
) -> Result<()> {
    fs::create_dir_all(output_path)?;

    let web_path = output_path.join("web");

    // Step 1: Copy frontend files to web/
    let files_to_skip = get_files_to_skip(include_docs, include_auth, false);
    copy_filtered(temp_path, &web_path, project_name, &files_to_skip, &[FULLSTACK_SUBDIR, "template.json"])?;

    // Update web/package.json (remove deps for disabled features)
    update_package_json(&web_path, include_docs, include_auth, false)?;

    if !include_auth {
        cleanup_layout_for_no_auth(&web_path)?;
    }

    // Step 2: Copy fullstack overlay files to root
    let fullstack_src = temp_path.join(FULLSTACK_SUBDIR);
    if fullstack_src.is_dir() {
        copy_filtered(&fullstack_src, output_path, project_name, &[], &["template.json"])?;
    }

    // Step 3: Generate .env for auth in web/ if needed
    if include_auth {
        generate_env_file(&web_path)?;
    }

    Ok(())
}

fn copy_filtered(
    src: &Path,
    dest: &Path,
    project_name: &str,
    files_to_skip: &[&str],
    extra_skip: &[&str],
) -> Result<()> {
    fs::create_dir_all(dest)?;

    for entry in WalkDir::new(src).min_depth(1) {
        let entry = entry?;
        let relative_path = entry.path().strip_prefix(src)?;
        let relative_str = relative_path.to_string_lossy();

        if should_skip_file(&relative_str, files_to_skip) {
            continue;
        }

        // Skip extra patterns (e.g. fullstack/ subdir when copying frontend)
        let skip_extra = extra_skip.iter().any(|p| relative_str.starts_with(p) || relative_str == *p);
        if skip_extra {
            continue;
        }

        let dest_path = dest.join(relative_path);

        if entry.file_type().is_dir() {
            fs::create_dir_all(&dest_path)?;
        } else {
            if let Some(parent) = dest_path.parent() {
                fs::create_dir_all(parent)?;
            }
            match fs::read_to_string(entry.path()) {
                Ok(content) => {
                    let processed = process_template(&content, project_name);
                    fs::write(&dest_path, processed)?;
                }
                Err(_) => {
                    fs::copy(entry.path(), &dest_path)?;
                }
            }
        }
    }

    Ok(())
}
```

**Step 2: Verify it compiles**

```bash
cargo build
```

Expected: compile error — `fullstack` module not declared yet. Next task wires everything.

**Step 3: Commit**

```bash
git add src/fullstack.rs
git commit -m "feat: add fullstack scaffolding module"
```

---

### Task 11: Wire fullstack into main.rs

**Files:**
- Modify: `src/main.rs`

**Step 1: Add fullstack module declaration**

Add at the top of `src/main.rs`:
```rust
mod fullstack;
```

Also update imports to include new UI types:
```rust
use ui::{
    create_spinner, outro_cancel, outro_success, outro_success_fullstack, outro_success_lib,
    Feature, Language, LibFeature, ProjectType,
};
```

**Step 2: Update `default_template_url` call sites**

In `cmd_init`, update the template URL logic. Replace the `template_url` line:

```rust
    let template_url = args
        .template
        .clone()
        .unwrap_or_else(|| {
            let pt = if is_fullstack { "fullstack" } else if is_lib { "lib" } else { "app" };
            default_template_url(pt).to_string()
        });
```

**Step 3: Add fullstack detection and routing**

Replace the project type detection block in `cmd_init`. The logic needs to handle three types:

```rust
    // Determine project type
    let project_type = if args.yes {
        if args.fullstack || args.project_type == "fullstack" {
            ProjectType::Fullstack
        } else if args.lib || args.project_type == "lib" {
            ProjectType::Lib
        } else {
            ProjectType::App
        }
    } else {
        ui::prompt_project_type()?
    };

    let is_lib = project_type == ProjectType::Lib;
    let is_fullstack = project_type == ProjectType::Fullstack;
```

Update the template URL and routing:

```rust
    let template_url = args
        .template
        .clone()
        .unwrap_or_else(|| {
            let pt = match project_type {
                ProjectType::Fullstack => "fullstack",
                ProjectType::Lib => "lib",
                ProjectType::App => "app",
            };
            default_template_url(pt).to_string()
        });

    // Clone template
    let temp_dir = tempfile::tempdir()?;
    let temp_path = temp_dir.path();

    let spinner = create_spinner("Fetching template...");
    clone_template(&template_url, temp_path)?;
    spinner.stop("Template fetched");

    match project_type {
        ProjectType::Lib => cmd_init_lib(&args, &project_name, &output_path, temp_path)?,
        ProjectType::Fullstack => cmd_init_fullstack(&args, &project_name, &output_path, temp_path)?,
        ProjectType::App => cmd_init_app(&args, &project_name, &output_path, temp_path)?,
    }
```

**Step 4: Add cmd_init_fullstack function**

```rust
fn cmd_init_fullstack(
    args: &InitArgs,
    project_name: &str,
    output_path: &PathBuf,
    temp_path: &std::path::Path,
) -> Result<()> {
    let (include_auth, include_docs) = if args.yes {
        (!args.no_auth, args.docs)
    } else {
        let selected = ui::prompt_features()?;
        (
            selected.contains(&Feature::Auth),
            selected.contains(&Feature::Docs),
        )
    };

    let spinner = create_spinner("Processing files...");

    fullstack::scaffold_fullstack(temp_path, output_path, project_name, include_auth, include_docs)?;

    spinner.stop("Files processed");
    Ok(())
}
```

**Step 5: Update the post-scaffolding section**

Replace the git init, install deps, and outro block:

```rust
    if !args.no_git {
        let spinner = create_spinner("Initializing git...");
        init_git(&output_path)?;
        spinner.stop("Git initialized");
    }

    match project_type {
        ProjectType::Fullstack => {
            // Install web dependencies
            if !args.no_install {
                let spinner = create_spinner("Installing dependencies...");
                install_deps(&output_path.join("web"))?;
                spinner.stop("Dependencies installed");
            }
            outro_success_fullstack(&project_name, &output_path);
        }
        ProjectType::Lib => {
            if !args.no_install {
                let spinner = create_spinner("Installing dependencies...");
                install_deps(&output_path)?;
                spinner.stop("Dependencies installed");
            }
            outro_success_lib(&project_name, &output_path, args.no_install);
        }
        ProjectType::App => {
            if !args.no_install {
                let spinner = create_spinner("Installing dependencies...");
                install_deps(&output_path)?;
                spinner.stop("Dependencies installed");
            }
            outro_success(&project_name, &output_path, args.no_install);
        }
    }
```

**Step 6: Run tests**

```bash
cargo test
```

Expected: all tests pass.

**Step 7: Verify it compiles**

```bash
cargo build
```

**Step 8: Commit**

```bash
git add src/main.rs
git commit -m "feat: wire fullstack project type into init command"
```

---

### Task 12: Add `ns dev` command — project detection

**Files:**
- Create: `src/runner.rs`

**Step 1: Create the runner module**

`src/runner.rs` implements project type detection and command dispatch:

```rust
use anyhow::{Context, Result};
use std::env;
use std::path::{Path, PathBuf};
use std::process::Command;

#[derive(Debug)]
enum ProjectKind {
    Fullstack,
    Frontend,
    Rust,
}

/// Walk up from CWD to find project root and its type.
fn detect_project(start: &Path) -> Result<(PathBuf, ProjectKind)> {
    let mut dir = start.to_path_buf();
    loop {
        if dir.join("devforge.toml").exists() {
            return Ok((dir, ProjectKind::Fullstack));
        }
        if dir.join("package.json").exists() {
            return Ok((dir, ProjectKind::Frontend));
        }
        if dir.join("Cargo.toml").exists() {
            return Ok((dir, ProjectKind::Rust));
        }
        if !dir.pop() {
            anyhow::bail!("No project root found (looked for devforge.toml, package.json, or Cargo.toml)");
        }
    }
}

pub fn cmd_dev() -> Result<()> {
    let cwd = env::current_dir().context("failed to get current directory")?;
    let (root, kind) = detect_project(&cwd)?;

    match kind {
        ProjectKind::Fullstack => {
            run_cmd(&root, "cargo", &["xtask", "dev"])?;
        }
        ProjectKind::Frontend => {
            run_cmd(&root, "bun", &["dev"])?;
        }
        ProjectKind::Rust => {
            run_cmd(&root, "cargo", &["run"])?;
        }
    }
    Ok(())
}

pub fn cmd_build() -> Result<()> {
    let cwd = env::current_dir().context("failed to get current directory")?;
    let (root, kind) = detect_project(&cwd)?;

    match kind {
        ProjectKind::Fullstack => {
            // Build Rust crates
            run_cmd(&root, "cargo", &["build", "--release"])?;
            // Build frontend
            let web_dir = root.join("web");
            if web_dir.exists() {
                run_cmd(&web_dir, "bun", &["run", "build"])?;
            }
        }
        ProjectKind::Frontend => {
            run_cmd(&root, "bun", &["run", "build"])?;
        }
        ProjectKind::Rust => {
            run_cmd(&root, "cargo", &["build", "--release"])?;
        }
    }
    Ok(())
}

fn run_cmd(dir: &Path, program: &str, args: &[&str]) -> Result<()> {
    let status = Command::new(program)
        .args(args)
        .current_dir(dir)
        .status()
        .with_context(|| format!("failed to run {program}"))?;

    if !status.success() {
        anyhow::bail!("{program} exited with {status}");
    }
    Ok(())
}
```

**Step 2: Verify it compiles (won't — module not declared yet)**

We'll wire it in the next task.

**Step 3: Commit**

```bash
git add src/runner.rs
git commit -m "feat: add project runner with dev and build commands"
```

---

### Task 13: Wire dev and build into CLI

**Files:**
- Modify: `src/cli.rs`
- Modify: `src/main.rs`

**Step 1: Add Dev and Build subcommands to cli.rs**

Update the `Commands` enum in `src/cli.rs`:

```rust
#[derive(Subcommand, Debug)]
pub enum Commands {
    /// Scaffold a new project
    Init(InitArgs),
    /// Start the dev environment (auto-detects project type)
    Dev,
    /// Build the project (auto-detects project type)
    Build,
}
```

**Step 2: Update main.rs to handle new commands**

Add `mod runner;` at top.

Update `main()` match:

```rust
fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Init(args) => cmd_init(args),
        Commands::Dev => runner::cmd_dev(),
        Commands::Build => runner::cmd_build(),
    }
}
```

**Step 3: Run tests**

```bash
cargo test
```

Expected: all existing tests pass.

**Step 4: Verify it compiles and runs**

```bash
cargo build
cargo run -- --help
```

Expected: help output shows `init`, `dev`, and `build` subcommands.

**Step 5: Commit**

```bash
git add src/cli.rs src/main.rs
git commit -m "feat: add ns dev and ns build commands"
```

---

### Task 14: Add tests for runner detection logic

**Files:**
- Modify: `src/runner.rs` (make detect_project pub(crate) for testing)

**Step 1: Make detect_project testable**

Change the function signature in `src/runner.rs`:

```rust
pub(crate) fn detect_project(start: &Path) -> Result<(PathBuf, ProjectKind)> {
```

Also derive `PartialEq` on `ProjectKind`:

```rust
#[derive(Debug, PartialEq)]
enum ProjectKind {
```

Make ProjectKind pub(crate) too:
```rust
#[derive(Debug, PartialEq)]
pub(crate) enum ProjectKind {
```

**Step 2: Write tests**

Add at the bottom of `src/runner.rs`:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    use std::fs;

    #[test]
    fn detect_fullstack_project() {
        let dir = tempdir().unwrap();
        fs::write(dir.path().join("devforge.toml"), "").unwrap();
        let (root, kind) = detect_project(dir.path()).unwrap();
        assert_eq!(root, dir.path());
        assert_eq!(kind, ProjectKind::Fullstack);
    }

    #[test]
    fn detect_frontend_project() {
        let dir = tempdir().unwrap();
        fs::write(dir.path().join("package.json"), "{}").unwrap();
        let (root, kind) = detect_project(dir.path()).unwrap();
        assert_eq!(root, dir.path());
        assert_eq!(kind, ProjectKind::Frontend);
    }

    #[test]
    fn detect_rust_project() {
        let dir = tempdir().unwrap();
        fs::write(dir.path().join("Cargo.toml"), "").unwrap();
        let (root, kind) = detect_project(dir.path()).unwrap();
        assert_eq!(root, dir.path());
        assert_eq!(kind, ProjectKind::Rust);
    }

    #[test]
    fn detect_fullstack_takes_priority() {
        let dir = tempdir().unwrap();
        fs::write(dir.path().join("devforge.toml"), "").unwrap();
        fs::write(dir.path().join("package.json"), "{}").unwrap();
        fs::write(dir.path().join("Cargo.toml"), "").unwrap();
        let (_, kind) = detect_project(dir.path()).unwrap();
        assert_eq!(kind, ProjectKind::Fullstack);
    }

    #[test]
    fn detect_walks_up() {
        let dir = tempdir().unwrap();
        fs::write(dir.path().join("package.json"), "{}").unwrap();
        let sub = dir.path().join("src");
        fs::create_dir(&sub).unwrap();
        let (root, kind) = detect_project(&sub).unwrap();
        assert_eq!(root, dir.path().to_path_buf());
        assert_eq!(kind, ProjectKind::Frontend);
    }

    #[test]
    fn detect_no_project_fails() {
        let dir = tempdir().unwrap();
        let result = detect_project(dir.path());
        assert!(result.is_err());
    }
}
```

**Step 3: Run tests**

```bash
cargo test
```

Expected: all tests pass.

**Step 4: Commit**

```bash
git add src/runner.rs
git commit -m "test: add project detection tests for runner"
```

---

## Phase 3: End-to-End Verification

### Task 15: Manual integration test

**Step 1: Build the CLI**

```bash
cd ~/Dev/projects/libs/create-sandybridge-app
cargo build
```

**Step 2: Scaffold a test fullstack project**

```bash
cd /tmp
cargo run --manifest-path ~/Dev/projects/libs/create-sandybridge-app/Cargo.toml -- init test-fullstack --fullstack --yes --no-install --no-git
```

**Step 3: Verify the scaffolded structure**

```bash
ls -la /tmp/test-fullstack/
ls -la /tmp/test-fullstack/web/
ls -la /tmp/test-fullstack/crates/api/src/
cat /tmp/test-fullstack/Cargo.toml
cat /tmp/test-fullstack/devforge.toml
cat /tmp/test-fullstack/.env.example
cat /tmp/test-fullstack/crates/api/Cargo.toml
```

Expected:
- Root has `Cargo.toml`, `devforge.toml`, `docker-compose.yml`, `mprocs.yaml`, `.env.example`
- `web/` has `package.json`, `src/`, `vite.config.ts`
- `crates/api/src/` has `main.rs`, `config.rs`, `state.rs`, `error.rs`
- All `{{project_name}}` placeholders replaced with `test-fullstack`

**Step 4: Verify Rust compiles (optional — requires devforge crate published or path dep)**

If devforge is published to crates.io:
```bash
cd /tmp/test-fullstack && cargo build
```

If not yet published, temporarily change xtask/Cargo.toml to use path dependency:
```bash
sed -i 's|devforge = "0.1"|devforge = { path = "'$HOME'/Dev/projects/libs/devforge" }|' /tmp/test-fullstack/xtask/Cargo.toml
cd /tmp/test-fullstack && cargo check
```

**Step 5: Clean up**

```bash
rm -rf /tmp/test-fullstack
```

**Step 6: Commit any fixes discovered during testing**

---

## Summary

| Task | Repo | What | Commit |
|------|------|------|--------|
| 1 | app-template | Fullstack template.json | `feat: add fullstack template.json` |
| 2 | app-template | Cargo workspace root files | `feat: add cargo workspace root files` |
| 3 | app-template | xtask crate | `feat: add xtask crate wrapping devforge` |
| 4 | app-template | API error.rs + Cargo.toml | `feat: add api crate skeleton with error types` |
| 5 | app-template | API config.rs + state.rs | `feat: add api config and state` |
| 6 | app-template | API main.rs | `feat: add api main.rs with axum server` |
| 7 | app-template | devforge.toml + infra files | `feat: add devforge, docker-compose, mprocs, and env template` |
| 8 | CLI | ProjectType::Fullstack + UI | `feat: add Fullstack project type to UI` |
| 9 | CLI | CLI args + template URL | `feat: add fullstack template URL and CLI flag` |
| 10 | CLI | Fullstack scaffolding module | `feat: add fullstack scaffolding module` |
| 11 | CLI | Wire into main.rs | `feat: wire fullstack project type into init command` |
| 12 | CLI | Runner module (dev/build) | `feat: add project runner with dev and build commands` |
| 13 | CLI | Wire dev/build into CLI | `feat: add ns dev and ns build commands` |
| 14 | CLI | Runner tests | `test: add project detection tests for runner` |
| 15 | Both | Manual integration test | (fix commits if needed) |
