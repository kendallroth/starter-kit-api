# `starter-kit-api`

Collection of projects providing a simple API package for `starter-kit-*` projects.

- TODO: Document Turborepo usage
- TODO: Document weirdness in server dev steps (maybe use nodemon to cleanup???)
- TODO: Figure out CLI wrapper for server (how it will be used in "production")
- TODO: Enforce linting before building
- TODO: Determine if Turborepo is necessary

## Projects

| Project | Status | Description |
|---------|--------|-------------|
| [Server](./packages/server/README.md) | ⌛ | Simple API/server
| [Shared](./packages/sharede/README.md) | ⌛ | Core utilities use by related packages

## Development

Development architecture heavily inspired by [Turbopack repo](https://turbo.build/repo/docs/handbook) and [Earthly blog](https://earthly.dev/blog/setup-typescript-monorepo/) (does not mention).

### Builds

Individual projects can be built with `npm run build --workspace ./packages/<PROJECT>`, or all projects can be built (via NPM workspaces) with `npm run build` in root.

### Installing dependencies

#### External dependencies

External dependencies should **not** be installed within individual projects, but rather _installed_ within the root project and referenced via _workspace_. For example, an external package could be installed from root with `npm install <PACKAGE> --workspace ./packages<PROJECT>`. Similarly, packages would be removed with `npm uninstall <PACKAGE> --workspace=<PROJECT>`.

#### Linking projects

Projects are automatically linked through use of NPM workspaces. To reference one project from another project, install from root with `npm install @localizer/<TARGET> --workspace ./packages/<PROJECT>`.
