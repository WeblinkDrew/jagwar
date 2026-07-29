---
title: Onlook Core Change Request Template
status: required-template
created: 2026-07-28
updated: 2026-07-28
---

# Onlook Core Change Request

Use one copy of this template for each original Onlook file proposed for modification. Do not edit the file until Andrew explicitly approves this request. Store approved requests in a target-side architecture/change-log directory with the implementing commit evidence.

## Identity

- Request ID:
- Date:
- Requester:
- Writable target repository:
- Branch:
- Pinned Onlook baseline commit:
- Exact original file path:
- Related story/requirement:

## Current responsibility

- What the file owns today:
- Existing consumers/public behavior:
- Whether it touches AI, editor/source application, auth, database, billing, publishing, preload/preview, shared UI, workspace config, or lockfile:

## Proposed change

- Exact purpose:
- Smallest proposed diff or pseudodiff:
- New files/modules that call or depend on it:

## Why additive-only alternatives are insufficient

- New package considered:
- New route-local feature considered:
- Existing public export/extension seam considered:
- Adapter/provider/composition option considered:
- Why each cannot satisfy the requirement:

## Compatibility and risk

- Existing Onlook behavior that must remain unchanged:
- AI/editor sensitivity:
- Public API/export effect:
- Data/migration effect:
- Dependency/lockfile effect:
- Upstream-sync/merge effect:
- Security/privacy/compliance effect:

## Verification and recovery

- Focused tests:
- Existing Onlook regression tests/commands:
- Jagwar acceptance tests:
- Manual/browser verification:
- Rollback procedure:

## Owner decision

- Decision: pending | approved | rejected | revise
- Andrew's exact confirmation/reference:
- Approved purpose and diff limits:
- Conditions:
- Reconfirmation required if:

Approval of this request covers only the exact file and purpose recorded above.
