# `starter-kit-api`

Simple API package for `starter-kit-*` projects.

## Features

- ✔️ Implement simple API (with CLI wrapper) for `starter-kit-*` projects
- ✔️ Provide utility functions for mimicking API behaviour in frontend mocking (via MSW, etc)
- ⌛ Handle development workflow (live reload either server or CLI)
  - Maybe support two dev workflows (ie. `dev:server` and `dev:cli`)
- ⌛ Add API error codes for client localization
- ⌛ Support writing API state to JSON file
- ⌛ Add API for resetting password
- ⌛ Add API for changing password
- ⌛ Add client SDK utility/workflow?

## Usage

### CLI

The `starter-kit` server is exposed as a simple CLI tool with limited options.

```sh
npm install @kendallroth/starter-kit-api
```

Once installed, the starter kit API can be used either with `npx` or as a project NPM script.

```sh
sk-api --port 3030
```

```json
{
  "scripts": {
    "api": "sk-api --port 3030"
  }
}
```

### Shared

There are some "shared" utilities that can be utilized by consuming projects for purposes of API/test mocks that mimic actual API responses/utilities.

```ts
import { paginate } from "@kendallroth/starter-kit-api/shared";
```

## API Documentation

[Swagger Doc](./src/generated/swagger.json)

## Development

| Script | Description |
|--------|-------------|
| `build` | Bundle server/CLI and generate `tsoa` routes/schema
| `dev` ⌛ | Run `tsoa` generators and dev server simultaneously (live reloads)
| `lint` | Check types and lint/format code
| `local:install` | Build project and link locally with NPM

### Build

[`tsup`](https://tsup.egoist.dev/) is used for bundling the library, and handles the multiple entry points (CLI vs shared). [`tsoa`](https://tsoa-community.github.io/docs/introduction.html) is used for generating API code and Swagger documentation.

## Publishing

The library is published through a GitHub Actions [workflow](./github/workflows/publish.yaml). Authentication for publishing is handled automatically by the `NPM_TOKEN` set in GitHub Actions secrets. The `prepublishOnly` script runs the build cycle (including `pre` and `post` scripts) to build the library before publishing.

All version changes must be accompanied with a corresponding `CHANGELOG.md` update, as well as a version bump. Versions can be bumped using `npm version <type>`, with the optional `--no-git-tag-version` flag to disable a Git commit and tag (should be handled manually).

```sh
npm version <major | minor | patch> --no-git-tag-version
```
