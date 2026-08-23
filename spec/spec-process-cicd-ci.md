---
title: CI/CD Workflow Specification - CI
version: 1.0
date_created: 2026-08-23
last_updated: 2026-08-23
owner: seankrux
tags: [process, cicd, github-actions, node, harpacast-mcp]
---

## Workflow Overview

**Purpose**: Optional Node install, lint, and test/build when scripts exist.
**Trigger Events**: Push and pull requests to main/master.
**Target Environments**: Ephemeral Ubuntu CI.

## Jobs & Dependencies

| Job Name | Purpose | Dependencies | Execution Context |
|---|---|---|---|
| build | Optional npm ci/lint/test or build | none | ubuntu-latest / Node 20 |

## Requirements Matrix

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| REQ-001 | Missing scripts are no-ops | Medium | `--if-present` or equivalent |
| REQ-002 | No secrets in YAML | High | Workflow references no credentials |

## Change Management

| Version | Date | Changes | Author |
|---|---|---|---|
| 1.0 | 2026-08-23 | Initial specification | fleet audit |
