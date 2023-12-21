# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed
- Display Swagger operation IDs
- Improve Swagger filtering to search tags and operation IDs
- Share Swagger UI config between dev server and production build

### Deprecated

### Removed

### Fixed

### Internal

<hr />

## `0.3.0` (2023-Dec-20)

### Added
- Optional database persistence (via `--persist <path>` flag)

### Changed
- Improve entity stubbing to initialize nullable fields

### Fixed
- API error responses were not fully defined
- Set `NODE_ENV` to `production` when bundling for NPM
- Database reset was referencing mutated values (not original)

<hr />

## `0.2.0` (2023-Dec-19)

### Added
- Change password route

### Internal
- Improve build/copy scripts
- Deploy Swagger doc to GitHub Pages
- Support live reloading in development (_with caveats_)

<hr />

## `0.1.0` (2023-Dec-13)

### Added
- CLI wrapper around simple API server for `starter-kit-*` projects
- Shared utilities for simplifying `starter-kit-*` API mocks/tests
