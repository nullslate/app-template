# Nullslate Rebrand Design

## Overview

Rebrand dev tooling ecosystem under a new GitHub org **nullslate**. The parent brand is "nullslate" for tooling; "sandybridge" remains the creator/personal brand.

## Ecosystem Structure

| Project | Repo | Crate/Package | Binary | Description |
|---------|------|---------------|--------|-------------|
| devkit | `nullslate/devkit` | `devkit` / `@nullslate/devkit` | (library) | Dev environment orchestrator (formerly devforge) |
| CLI | `nullslate/cli` | `darkslate-cli` / `@nullslate/cli` | `nullslate`, `ns` | Multi-subcommand CLI for scaffolding + future tools |
| tileforge | stays as-is | stays as-is | stays as-is | Affiliated project, keeps own name |

NPM packages `@thesandybridge/themes` and `@thesandybridge/ui` are unchanged in this phase.

## Part 1: devforge → devkit

Rename the Rust library crate at `/home/sbx/Dev/projects/libs/devforge`.

| What | Before | After |
|------|--------|-------|
| Crate name | `devforge` | `devkit` |
| Config file | `devforge.toml` | `devkit.toml` |
| Console prefix | `[devforge]` | `[devkit]` |
| Repository URL | `github.com/thesandybridge/devforge` | `github.com/nullslate/devkit` |
| Public API | `devforge::run()` | `devkit::run()` |

### Files to modify

- `Cargo.toml` — crate name, repository URL
- `src/lib.rs` — doc comments, `devforge.toml` path references
- `src/env.rs` — console prefix `[devforge]` → `[devkit]`, `devforge.toml` path searches
- `README.md` — all references
- `CHANGELOG.md` — GitHub comparison URLs
- `CLAUDE.md` — title, description
- `tests/config_test.rs` — `use devforge::Config` → `use devkit::Config`
- `tests/integration_test.rs` — same import change

Consumer xtask crates (tileforge, safe-route-private) need separate updates: `devforge = "0.3"` → `devkit = "0.4"`.

## Part 2: create-sandybridge-app → nullslate CLI

Restructure the Rust CLI at `/home/sbx/Dev/projects/libs/create-sandybridge-app` into a multi-subcommand CLI.

### Binary names

- `nullslate` — primary binary
- `ns` — short alias (same binary, detects name via `arg0`)

### Subcommand structure

```
nullslate init <project-name> [OPTIONS]    # Scaffold a new project
nullslate --help                            # Show available subcommands
```

Future subcommands (not in scope): `nullslate dev`, `nullslate deploy`, etc.

### CLI architecture

Use clap with `#[command(subcommand)]` derive:

```rust
#[derive(Parser)]
#[command(name = "nullslate")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

enum Commands {
    Init(InitArgs),
}
```

`InitArgs` contains the current `Args` fields (name, --docs, --no-auth, --db, --path, --no-git, --no-install, --template, -y).

### Template source

- Template files live in `template/` directory inside the CLI repo
- Default `--template` URL points to `https://github.com/nullslate/cli.git`
- CLI clones from repo at runtime, extracts template from clone
- `--template <url>` still works for custom overrides
- The app-template repo (`/home/sbx/Dev/projects/libs/app-template`) contents move into the CLI repo's `template/` directory

### Branding changes

| What | Before | After |
|------|--------|-------|
| Crate name | `create-sandybridge-app` | `nullslate-cli` |
| Binary | `create-sandybridge-app` | `nullslate`, `ns` |
| CLI intro | `create-sandybridge-app` | `nullslate` |
| Description | "Scaffold a new sandybridge.io project" | "Scaffold a new nullslate project" |
| Default template | `github.com/thesandybridge/app-template.git` | `github.com/nullslate/cli.git` |
| Git commit msg | "Initial commit from create-sandybridge-app" | "Initial commit from nullslate" |
| npm update | `@thesandybridge/themes@latest`, `@thesandybridge/ui@latest` | same (unchanged for now) |

### Files to modify

- `Cargo.toml` — crate name, bin entries, description
- `src/cli.rs` — command name, about, DEFAULT_TEMPLATE_REPO, subcommand structure
- `src/ui.rs` — intro text
- `src/template.rs` — git commit message, template extraction from clone
- `src/main.rs` — subcommand dispatch
- `README.md` — all references
- `tests/integration.rs` — binary path

## Part 3: Template internalization

The app template currently lives as a separate repo. It moves into the CLI repo:

```
nullslate-cli/
├── src/           # CLI source
├── template/      # App template (formerly app-template repo)
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   └── ...
├── tests/
├── Cargo.toml
└── README.md
```

The CLI's clone logic changes: instead of cloning the whole repo as the template, it clones the CLI repo and copies from the `template/` subdirectory.

## Part 4: Cross-reference updates

- `@thesandybridge/themes` and `@thesandybridge/ui` references inside the template stay as-is (separate rebrand phase)
- devkit README examples update `devforge` → `devkit`
- Migration plan docs in app-template that reference devforge/create-sandybridge-app get updated

## Out of scope

- Renaming `@thesandybridge/themes` → `@nullslate/themes`
- Renaming `@thesandybridge/ui` → `@nullslate/ui`
- Creating the GitHub org / repos (manual step)
- Publishing to crates.io under new names
- Updating consumer xtask crates (tileforge, safe-route-private)
