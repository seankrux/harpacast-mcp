---
title: CI/CD Workflow Specification - CodeQL
version: 1.0
date_created: 2026-08-23
last_updated: 2026-08-23
owner: seankrux
tags: [process, cicd, github-actions, security, codeql, harpacast-mcp]
---

## Workflow Overview

**Purpose**: Copied CodeQL analysis template for javascript/python.
**Trigger Events**: Daily 02:00 UTC; push to main/master; pull requests.
**Target Environments**: Ephemeral Ubuntu CI.

## Execution Flow Diagram

```mermaid
graph TD
    A[Schedule / push / PR] --> B[analyze]
    B --> C[End]
    style A fill:#e1f5fe
    style C fill:#e8f5e8
```

## Jobs & Dependencies

| Job Name | Purpose | Dependencies | Execution Context |
|---|---|---|---|
| analyze | CodeQL init/autobuild/analyze | none | ubuntu-latest |

## Requirements Matrix

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| REQ-001 | Scan configured languages | Medium | Init + analyze complete |
| SEC-001 | No extra credentials | High | Uses default GitHub token only |

## Notes

This is a copied fleet template. Language matrix should be narrowed if the repo is not polyglot.

## Change Management

| Version | Date | Changes | Author |
|---|---|---|---|
| 1.0 | 2026-08-23 | Initial specification | fleet audit |
