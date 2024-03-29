# `starter-kit-api`

Simple API package for `starter-kit-*` projects.

## Features

- ✔️ Simple Express API (with CLI wrapper) for `starter-kit-*` projects
- ✔️ CLI wrapper for API (support partial configuration)
- ✔️ Utility functions for mimicking API behaviour (ie. in frontend mocking, via MSW, etc)
- ✔️ API error codes (for client localization)
- ✔️ Swagger documentation pages (via GitHub Actions)
- ✔️ Development workflow (live reloading with `tsup`)
- ✔️ Optional persistence of API state (with JSON file)
- ⌛ Use FakerJS for consistent seed data (UUIDs, timestamps, etc)
- ⌛ Support entity filtering and searching
- ⌛ Add API for resetting password
- ⌛ Implement API localization
- ❓ Support `--no-auth` parameter for non-authenticated frontends (defaults to single user)?
- ❓ Add client SDK utility/workflow?
- ❓ Separate CLI project (`starter-kit-cli`) referencing API

## Usage

### CLI

The `starter-kit` server is exposed as a simple CLI tool with limited options.

```sh
npm install @kendallroth/starter-kit-api
```

Once installed, the starter kit API can be used either with `npx` or as a project NPM script.

```sh
sk-api --persist ./database.json
```

```json
{
  "scripts": {
    "api": "sk-api --persist './database.json'"
  }
}
```

> **NOTE:** By default the server will use an in-memory database, which will be reset with server restarts. The database can also be persisted to a JSON file with the `--persist <path>` argument.

#### Documentation

```
Usage: sk-api [options]

Simple API for `starter-kit-*` projects

Options:
  -v, --version             Display CLI version
  --auth-jwt-expiry <time>  Auth JWT token expiry time (min) (default: 15)
  --persist <path>          Database persistence file path (JSON)
  --no-logs                 Whether request/response logs are disabled
  --log-requests            Whether requests are logged (alongside responses) (default: false)
  -p, --port <number>       Server port (default: 3001)
  -h, --help                Display help for command
```

### Shared

There are some "shared" utilities that can be utilized by consuming projects for purposes of API/test mocks that mimic actual API responses/utilities.

```ts
import { paginate } from "@kendallroth/starter-kit-api/shared";
```

## API Documentation

- [Swagger Doc (Site)](https://kendallroth.github.io/starter-kit-api/)
- [Swagger Doc (JSON)](./docs/swagger.json)

## Development

| Script | Description |
|--------|-------------|
| `build` | Bundle server/CLI and generate `tsoa` routes/schema
| `dev` ⌛ | Compile/run `tsoa` generators and dev server (with live reloads)
| `lint` | Check types and lint/format code
| `local:install` | Build project and link locally with NPM
| `local:run` | Run commands against local CLI build (requires `--` prefix)
| `local:uninstall` | Remove global dev NPM link

### Live Reloading

Live reloading in development is accomplished through `tsup`'s `onSuccess` callback workflow. However, there are several caveats associated with reloading!

When code changes are detected, `tsoa` must be run **before** rebundling the CLI in order to have the generated route file present for bundling! This is accomplished by using the `onSuccess` callback cleanup function to regenerate `tsoa` files when changes are detected, _before_ initiating the rebuild and next `onSuccess` callback! Once a rebuild has completed, the generated `tsoa` files must be copied into the necessary directories (ie `build`, `docs`, etc). Finally, the server can be restarted (via bundled CLI). Unfortunately, due to module import errors (regardless of CJS/ESM), the bundled server cannot be imported inside the `onSuccess` callback. Instead, a workaround using Node's process `spawn` function handles stopping the previous server (in cleanup) and starting again. This is less than ideal, but unfortunately required to support live reloading.

> **NOTE:** Unfortunately a workaround involving using `spawn` on the compiled CLI is required for live-reloading in development, due to import errors when attempting to use compiled files directly in `tsup` `onSuccess` callback.

### Build

[`tsup`](https://tsup.egoist.dev/) is used for bundling the library, and handles the multiple entry points (CLI vs shared). [`tsoa`](https://tsoa-community.github.io/docs/introduction.html) is used for generating API code and Swagger documentation.

## Publishing

The library is published through a GitHub Actions [workflow](./github/workflows/publish.yaml). Authentication for publishing is handled automatically by the `NPM_TOKEN` set in GitHub Actions secrets. The `prepublishOnly` script runs the build cycle (including `pre` and `post` scripts) to build the library before publishing.

All version changes must be accompanied with a corresponding `CHANGELOG.md` update, as well as a version bump. Versions can be bumped using `npm version <type>`, with the optional `--no-git-tag-version` flag to disable a Git commit and tag (should be handled manually).

```sh
npm version <major | minor | patch> --no-git-tag-version
```
