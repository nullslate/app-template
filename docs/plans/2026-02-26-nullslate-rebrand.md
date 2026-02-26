# Nullslate Rebrand Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebrand dev tooling under the "nullslate" org — rename devforge→devkit and create-sandybridge-app→nullslate CLI.

**Architecture:** Two independent repos modified. devforge gets a find-and-replace rename to devkit. The CLI gets restructured as a multi-subcommand binary (`nullslate`/`ns`) with `init` as the first subcommand. Template cloned from `nullslate/cli` repo at runtime.

**Tech Stack:** Rust, clap (derive), cliclack, serde

**Design doc:** `docs/plans/2026-02-26-nullslate-rebrand-design.md`

---

## Phase 1: Rename devforge → devkit

All changes in `/home/sbx/Dev/projects/libs/devforge`.

### Task 1: Rename crate and metadata

**Files:**
- Modify: `Cargo.toml`

**Step 1: Update Cargo.toml**

```toml
[package]
name = "devkit"
version = "0.3.0"
edition = "2021"
description = "Dev environment orchestrator — docker, health checks, mprocs, custom commands via TOML config"
license = "MIT"
repository = "https://github.com/nullslate/devkit"
keywords = ["xtask", "dev", "docker", "orchestrator"]
categories = ["development-tools"]
```

Only `name` and `repository` change.

**Step 2: Verify build**

Run: `cargo build`
Expected: Compiles with new crate name.

**Step 3: Commit**

```bash
git add Cargo.toml Cargo.lock
git commit -m "chore: rename crate devforge → devkit"
```

### Task 2: Rename config file references in source

**Files:**
- Modify: `src/lib.rs:15,20` — `devforge.toml` → `devkit.toml`
- Modify: `src/env.rs:7,11,57,62` — `[devforge]` → `[devkit]`, `devforge.toml` → `devkit.toml`

**Step 1: Update src/lib.rs**

Line 11 doc comment:
```rust
/// Entry point for consumer xtask binaries. Reads `devkit.toml` from the
/// workspace root and dispatches the subcommand.
```

Line 15:
```rust
let toml_path = root.join("devkit.toml");
```

Line 20:
```rust
env::fatal(&format!("Failed to parse devkit.toml: {e}"));
```

**Step 2: Update src/env.rs**

Line 7:
```rust
eprintln!("\x1b[32m[devkit]\x1b[0m {msg}");
```

Line 11:
```rust
eprintln!("\x1b[31m[devkit]\x1b[0m {msg}");
```

Line 57:
```rust
if dir.join("devkit.toml").exists() {
```

Line 62:
```rust
None => fatal("Could not find devkit.toml in any parent directory"),
```

**Step 3: Verify build + tests**

Run: `cargo build && cargo test`
Expected: All pass.

**Step 4: Commit**

```bash
git add src/lib.rs src/env.rs
git commit -m "chore: rename devforge.toml → devkit.toml in source"
```

### Task 3: Update test imports

**Files:**
- Modify: `tests/config_test.rs:1` — `use devforge::Config` → `use devkit::Config`
- Modify: `tests/integration_test.rs:1` — `use devforge::Config` → `use devkit::Config`

**Step 1: Update imports**

Both files line 1:
```rust
use devkit::Config;
```

**Step 2: Run tests**

Run: `cargo test`
Expected: All pass.

**Step 3: Commit**

```bash
git add tests/
git commit -m "chore: update test imports devforge → devkit"
```

### Task 4: Update documentation

**Files:**
- Modify: `README.md` — all `devforge` → `devkit` references
- Modify: `CHANGELOG.md` — GitHub URLs `thesandybridge/devforge` → `nullslate/devkit`, content references
- Modify: `CLAUDE.md` — title and description references

**Step 1: Update README.md**

Replace all occurrences:
- `# devforge` → `# devkit`
- `devforge = "0.3"` → `devkit = "0.3"`
- `devforge::run()` → `devkit::run()`
- `devforge.toml` → `devkit.toml` (all instances)
- `[devforge]` → `[devkit]` (health check error example)
- `devforge copies` → `devkit copies`

**Step 2: Update CHANGELOG.md**

Replace all occurrences:
- `devforge` → `devkit` in prose
- `devforge.toml` → `devkit.toml`
- `thesandybridge/devforge` → `nullslate/devkit` in URLs

**Step 3: Update CLAUDE.md**

Replace all occurrences:
- `# devforge` → `# devkit`
- `devforge` → `devkit` (library name, API references)
- `devforge.toml` → `devkit.toml`

**Step 4: Commit**

```bash
git add README.md CHANGELOG.md CLAUDE.md
git commit -m "docs: update all references devforge → devkit"
```

---

## Phase 2: Rebrand CLI as nullslate

All changes in `/home/sbx/Dev/projects/libs/create-sandybridge-app`.

### Task 5: Update Cargo.toml — crate name and binaries

**Files:**
- Modify: `Cargo.toml`

**Step 1: Update Cargo.toml**

```toml
[package]
name = "nullslate-cli"
version = "0.2.0"
edition = "2021"
description = "CLI for the nullslate dev tooling ecosystem"
authors = ["thesandybridge"]

[[bin]]
name = "nullslate"
path = "src/main.rs"

[[bin]]
name = "ns"
path = "src/main.rs"
```

Two `[[bin]]` entries — both point to the same `src/main.rs`. Same binary, two names.

**Step 2: Verify build**

Run: `cargo build`
Expected: Produces both `target/debug/nullslate` and `target/debug/ns`.

**Step 3: Commit**

```bash
git add Cargo.toml Cargo.lock
git commit -m "chore: rename crate to nullslate-cli, add nullslate + ns binaries"
```

### Task 6: Add subcommand structure to cli.rs

**Files:**
- Modify: `src/cli.rs`

**Step 1: Restructure with clap subcommands**

```rust
use clap::{Parser, Subcommand};
use std::path::PathBuf;

const DEFAULT_TEMPLATE_REPO: &str = "https://github.com/nullslate/cli.git";

#[derive(Parser, Debug)]
#[command(name = "nullslate")]
#[command(about = "CLI for the nullslate dev tooling ecosystem", long_about = None)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand, Debug)]
pub enum Commands {
    /// Scaffold a new project
    Init(InitArgs),
}

#[derive(Parser, Debug)]
pub struct InitArgs {
    /// Name of the project to create
    #[arg(index = 1)]
    pub name: Option<String>,

    /// Include MDX documentation system
    #[arg(long)]
    pub docs: bool,

    /// Skip Auth.js authentication setup
    #[arg(long)]
    pub no_auth: bool,

    /// Database type: postgres or none
    #[arg(long, default_value = "none")]
    pub db: String,

    /// Output directory (default: ./<project-name>)
    #[arg(long)]
    pub path: Option<PathBuf>,

    /// Skip git initialization
    #[arg(long)]
    pub no_git: bool,

    /// Skip npm install
    #[arg(long)]
    pub no_install: bool,

    /// Custom template repository URL
    #[arg(long, default_value = DEFAULT_TEMPLATE_REPO)]
    pub template: String,

    /// Accept all defaults without prompting
    #[arg(short, long)]
    pub yes: bool,
}
```

**Step 2: Verify build**

Run: `cargo build`
Expected: Compiles. `cargo run -- init --help` shows init subcommand help.

**Step 3: Commit**

```bash
git add src/cli.rs
git commit -m "feat: add clap subcommand structure with init command"
```

### Task 7: Update main.rs for subcommand dispatch

**Files:**
- Modify: `src/main.rs`

**Step 1: Update main.rs**

```rust
mod cli;
mod features;
mod template;
mod ui;

use anyhow::Result;
use clap::Parser;
use regex::Regex;
use std::path::PathBuf;

use cli::{Cli, Commands, InitArgs};
use features::{
    cleanup_layout_for_no_auth, generate_env_file, get_files_to_skip, update_package_json,
};
use template::{clone_template, copy_template, init_git, install_deps};
use ui::{create_spinner, outro_cancel, outro_success, Feature};

fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Init(args) => cmd_init(args),
    }
}

fn cmd_init(args: InitArgs) -> Result<()> {
    if !args.yes {
        ui::intro()?;
    }

    let project_name = match args.name {
        Some(name) => name,
        None => {
            if args.yes {
                outro_cancel("Project name is required when using --yes flag");
                anyhow::bail!("Project name is required when using --yes flag");
            }
            ui::prompt_project_name()?
        }
    };

    let name_regex = Regex::new(r"^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$")?;
    if !name_regex.is_match(&project_name) {
        let msg = format!(
            "Invalid project name '{}'. Use lowercase letters, numbers, and hyphens only.",
            project_name
        );
        outro_cancel(&msg);
        anyhow::bail!("{}", msg);
    }

    let output_path = args.path.unwrap_or_else(|| PathBuf::from(&project_name));

    if output_path.exists() {
        let msg = format!("Directory '{}' already exists", output_path.display());
        outro_cancel(&msg);
        anyhow::bail!("{}", msg);
    }

    let (include_auth, include_docs, include_db) = if args.yes {
        (!args.no_auth, args.docs, args.db != "none")
    } else {
        let selected = ui::prompt_features()?;
        (
            selected.contains(&Feature::Auth),
            selected.contains(&Feature::Docs),
            selected.contains(&Feature::Db),
        )
    };

    let temp_dir = tempfile::tempdir()?;
    let temp_path = temp_dir.path();

    let spinner = create_spinner("Fetching template...");
    clone_template(&args.template, temp_path)?;
    spinner.stop("Template fetched");

    let spinner = create_spinner("Processing files...");

    let files_to_skip = get_files_to_skip(include_docs, include_auth, include_db);
    copy_template(temp_path, &output_path, &project_name, &files_to_skip)?;

    update_package_json(&output_path, include_docs, include_auth, include_db)?;

    if !include_auth {
        cleanup_layout_for_no_auth(&output_path)?;
    }

    if include_auth {
        generate_env_file(&output_path)?;
    }

    spinner.stop("Files processed");

    if !args.no_git {
        let spinner = create_spinner("Initializing git...");
        init_git(&output_path)?;
        spinner.stop("Git initialized");
    }

    if !args.no_install {
        let spinner = create_spinner("Installing dependencies...");
        install_deps(&output_path)?;
        spinner.stop("Dependencies installed");
    }

    outro_success(&project_name, &output_path, args.no_install);

    Ok(())
}
```

**Step 2: Verify build + unit tests**

Run: `cargo build && cargo test`
Expected: All pass.

**Step 3: Commit**

```bash
git add src/main.rs
git commit -m "feat: dispatch init subcommand from main"
```

### Task 8: Update UI branding

**Files:**
- Modify: `src/ui.rs:5` — intro text

**Step 1: Update intro**

```rust
cliclack::intro("nullslate")?;
```

**Step 2: Verify build**

Run: `cargo build`

**Step 3: Commit**

```bash
git add src/ui.rs
git commit -m "chore: update CLI intro branding to nullslate"
```

### Task 9: Update template.rs branding

**Files:**
- Modify: `src/template.rs:102` — git commit message
- Modify: `src/template.rs:130-145` — npm update comments and package names

**Step 1: Update git commit message (line 102)**

```rust
.args(["commit", "-m", "Initial commit from nullslate"])
```

**Step 2: Update npm package update section (lines 130-145)**

```rust
    // Update nullslate packages to latest versions
    let update_status = Command::new("npm")
        .args([
            "install",
            "@thesandybridge/themes@latest",
            "@thesandybridge/ui@latest",
        ])
        .current_dir(output_path)
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null())
        .status();

    if let Err(e) = update_status {
        eprintln!(
            "Warning: Failed to update packages: {}",
            e
        );
    }
```

Note: The npm package names `@thesandybridge/themes` and `@thesandybridge/ui` stay as-is — those packages haven't been rebranded yet. Only update the comment and error message.

**Step 3: Verify build + tests**

Run: `cargo build && cargo test`

**Step 4: Commit**

```bash
git add src/template.rs
git commit -m "chore: update template.rs branding to nullslate"
```

### Task 10: Update integration tests

**Files:**
- Modify: `tests/integration.rs`

**Step 1: Update binary path and CLI args**

The integration tests need to:
1. Reference the new binary name `nullslate`
2. Use `init` subcommand before project name

```rust
use std::process::Command;

fn cargo_bin() -> String {
    let output = Command::new("cargo")
        .args(["build", "--message-format=short"])
        .output()
        .expect("Failed to build");
    assert!(output.status.success(), "cargo build failed");

    format!(
        "{}/target/debug/nullslate",
        env!("CARGO_MANIFEST_DIR")
    )
}

#[test]
#[ignore] // requires network for git clone
fn scaffold_minimal_project() {
    let bin = cargo_bin();
    let dir = tempfile::tempdir().unwrap();
    let project_path = dir.path().join("test-minimal");

    let status = Command::new(&bin)
        .args([
            "init",
            "test-minimal",
            "--no-git",
            "--no-install",
            "--no-auth",
            "--db",
            "none",
            "-y",
            "--path",
            project_path.to_str().unwrap(),
        ])
        .status()
        .expect("Failed to run CLI");

    assert!(status.success(), "CLI exited with error");
    assert!(project_path.exists(), "Project directory not created");
    assert!(
        project_path.join("package.json").exists(),
        "package.json not found"
    );
    assert!(
        project_path.join("vite.config.ts").exists()
            || project_path.join("index.html").exists(),
        "Expected Vite project files"
    );
    assert!(
        !project_path.join("src/lib/auth.ts").exists(),
        "auth.ts should be skipped"
    );
    assert!(
        !project_path.join(".env").exists(),
        ".env should not exist without auth"
    );
}

#[test]
#[ignore] // requires network for git clone
fn scaffold_with_auth() {
    let bin = cargo_bin();
    let dir = tempfile::tempdir().unwrap();
    let project_path = dir.path().join("test-auth");

    let status = Command::new(&bin)
        .args([
            "init",
            "test-auth",
            "--no-git",
            "--no-install",
            "--db",
            "none",
            "-y",
            "--path",
            project_path.to_str().unwrap(),
        ])
        .status()
        .expect("Failed to run CLI");

    assert!(status.success(), "CLI exited with error");
    assert!(project_path.join(".env").exists(), ".env should exist with auth");

    let env_content = std::fs::read_to_string(project_path.join(".env")).unwrap();
    assert!(
        env_content.contains("AUTH_SECRET="),
        ".env should contain AUTH_SECRET"
    );
    assert!(
        env_content.contains("AUTH_GITHUB_ID="),
        ".env should contain AUTH_GITHUB_ID"
    );
    assert!(
        !env_content.contains("DATABASE_URL"),
        ".env should not contain DATABASE_URL"
    );
    assert!(
        !env_content.contains("JWT_SECRET"),
        ".env should not contain JWT_SECRET"
    );
}
```

**Step 2: Run unit tests**

Run: `cargo test`
Expected: 10 unit tests pass, 2 integration tests ignored.

**Step 3: Commit**

```bash
git add tests/integration.rs
git commit -m "chore: update integration tests for nullslate CLI"
```

### Task 11: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Rewrite README**

```markdown
# nullslate

CLI for the nullslate dev tooling ecosystem.

## Installation

```bash
cargo install --path .
```

## Usage

```bash
nullslate <command> [options]
# or use the short alias:
ns <command> [options]
```

### Commands

#### `init` — Scaffold a new project

```bash
nullslate init <project-name> [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--docs` | Include MDX documentation system |
| `--no-auth` | Skip Auth.js authentication setup |
| `--db <type>` | Database type: `postgres` or `none` (default) |
| `--path <dir>` | Output directory (default: `./<project-name>`) |
| `--no-git` | Skip git initialization |
| `--no-install` | Skip npm install |
| `--template <url>` | Custom template repository URL |
| `-y, --yes` | Accept all defaults without prompting |

### Examples

**Interactive mode:**
```bash
nullslate init my-app
```

**With all features:**
```bash
ns init my-app --docs --db postgres
```

**Non-interactive (CI):**
```bash
nullslate init my-app -y
```

## What's Included

Scaffolded projects include:

- **Vite** with React 19 and TanStack Router
- **TypeScript**
- **Tailwind CSS 4** with theme support
- **shadcn/ui** components
- **TanStack React Query** for server state

### Optional Features

- **Authentication**: Auth.js with GitHub OAuth
- **Documentation**: MDX docs system
- **Database**: PostgreSQL via `pg`

## Environment Variables

When auth is enabled, a `.env` file is generated:

```env
AUTH_SECRET=<random-64-char-hex>
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for nullslate branding"
```

### Task 12: Update template clone to extract from subdirectory

**Files:**
- Modify: `src/template.rs` — `clone_template` function

**Step 1: Update clone_template**

When the default template repo is used (nullslate/cli), the template lives in a `template/` subdirectory. The function needs to handle this:

```rust
const TEMPLATE_SUBDIR: &str = "template";

pub fn clone_template(template_url: &str, dest: &Path) -> Result<()> {
    let clone_dir = dest.join("_clone");

    let status = Command::new("git")
        .args([
            "clone",
            "--depth",
            "1",
            template_url,
            clone_dir.to_str().unwrap(),
        ])
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null())
        .status()
        .context("Failed to clone template repository")?;

    if !status.success() {
        anyhow::bail!("Failed to clone template from {}", template_url);
    }

    // If the clone contains a template/ subdirectory, use that as the source
    let source = if clone_dir.join(TEMPLATE_SUBDIR).is_dir() {
        clone_dir.join(TEMPLATE_SUBDIR)
    } else {
        clone_dir.clone()
    };

    // Move contents from source to dest
    for entry in fs::read_dir(&source)? {
        let entry = entry?;
        let target = dest.join(entry.file_name());
        fs::rename(entry.path(), target)?;
    }

    // Clean up the clone directory
    fs::remove_dir_all(&clone_dir)?;

    Ok(())
}
```

This is backwards-compatible: if `--template` points to a repo without a `template/` subdirectory (e.g. the old app-template repo), it uses the whole repo as before.

**Step 2: Run tests**

Run: `cargo test`
Expected: Unit tests pass.

**Step 3: Commit**

```bash
git add src/template.rs
git commit -m "feat: extract template from subdirectory when present"
```

---

## Phase 3: Verification

### Task 13: Full build and test pass

**Step 1: Verify devkit**

```bash
cd /home/sbx/Dev/projects/libs/devforge
cargo build
cargo test
cargo clippy -- -D warnings
```

Expected: All pass.

**Step 2: Verify CLI**

```bash
cd /home/sbx/Dev/projects/libs/create-sandybridge-app
cargo build
cargo test
```

Expected: Both `nullslate` and `ns` binaries built. 10 unit tests pass.

**Step 3: Smoke test**

```bash
cd /tmp
/home/sbx/Dev/projects/libs/create-sandybridge-app/target/debug/nullslate init --help
/home/sbx/Dev/projects/libs/create-sandybridge-app/target/debug/ns init --help
```

Expected: Both show the init subcommand help with nullslate branding.
