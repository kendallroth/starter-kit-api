# `server`

Simple API for `starter-kit-*` projects.

## Todo ⌛

- [ ] Add API error codes for client localization
- [ ] Add API for resetting password
- [ ] Add API for changing password

## Development

| Script | Description |
|--------|-------------|
| `build` | Generate `tsoa` routes/schema and build server
| `dev` | Run `tsoa` generators and dev server simultaneously (live reloads)
| `dev:server` | Run dev server (live reloads)
| `dev:tsoa` | Run `tsoa` generators (live reloads)
| `start` | Start built API server

## Build

To generate `tsoa` routes and schemas alongside the compiled server, use NPM build script (`npm run build`). `tsoa`-generated files, including the routes and Swagger schema, are created within the `generated/` directory. The Swagger schema is committed for ease-of-reference, although it could be removed in the future if there is no benefit...

> **NOTE:** TS paths must be converted to regular file paths before running in Node, which is handled auomatically by `tsc-alias`.

## API Scheme

[Swagger Doc](./src/generated/swagger.json)

