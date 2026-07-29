---
title: Product Brief — Jagwar Business Workflows on Onlook
status: final
created: 2026-07-28
updated: 2026-07-28
---

# Product Brief — Jagwar Business Workflows on Onlook

## Product thesis

Jagwar helps a new freelancer or solo agency sell websites by turning prospecting, proof, and outreach into one connected workflow. The user does not begin with a blank editor and hope to find a customer later. They begin with a real local business, identify why that business is a good prospect, create a personalized website for it, publish a real preview, and contact the owner with proof already in hand.

Onlook supplies the website-building engine and product foundation. Jagwar supplies the commercial operating loop around it as an additive extension that follows Onlook's repository and engineering practices without deprecating existing capabilities.

## The user

The primary user is an aspiring website seller: a freelancer, side-hustler, or one-person agency who can learn design but struggles to build a consistent sales pipeline. They are price-sensitive, easily discouraged by empty-start experiences, and need momentum quickly.

Their jobs to be done are:

- find local businesses likely to need a new or better website;
- understand why each business is a worthwhile prospect;
- turn verified business information into a credible personalized website;
- contact the prospect with a real published example instead of a generic pitch;
- track every prospect from discovery through contact and conversion;
- understand the next action to take and, after the evidence-based commercial model is approved, usage and remaining allowance.

The local business is not Jagwar's direct customer. It is the user's prospect and the subject of the generated project.

## Core value loop

1. **Find:** Search a niche and location and request a bounded number of businesses.
2. **Qualify:** Normalize business facts, inspect the current website, check contact viability, and rank the strongest opportunities.
3. **Organize:** Add selected businesses to a simple CRM pipeline.
4. **Create:** Generate or seed an Onlook project using verified business facts and an appropriate design direction.
5. **Refine:** Use Onlook's editor and AI workflow to finish the site.
6. **Publish:** Publish through Onlook and obtain the exact public preview URL.
7. **Contact:** Send a personalized message containing that exact URL through an approved outreach connector.
8. **Close:** Track contact and deal stage until Converted or Lost.

## First-session promise

The product rehearses the business through a 5+2+1 activation loop:

- uncover 5 leads;
- create 2 personalized website projects;
- complete 1 compliant outreach send.

The user should encounter the paywall after they have had a fair opportunity to complete this loop, not before the product has demonstrated its value.

## Differentiation

Onlook already provides a strong code-first AI builder. Jagwar differentiates the combined product through:

- live local-business discovery;
- Jagwar-owned opportunity qualification rather than provider marketing labels;
- deterministic separation of verified facts from generated persuasion copy;
- a CRM connected directly to the website project and its publication;
- personalized outreach from the same product;
- activation aligned with completing real commercial work and pricing decided later from measured target operating costs.

## MVP capabilities

- Authentication and workspace/account isolation using the target platform's native model.
- Find Leads with one search field, requested count, map/list results, qualification, ranking, selection, and saved runs.
- Manual lead entry for prospects found elsewhere.
- Pipeline with six stages and lead details.
- Lead → Onlook project creation/opening.
- Exact published-project association.
- Managed WhatsApp onboarding and compliant single-lead sending.
- Multi-select fan-out where each lead receives its own project URL and its own durable send record.
- Activation progress and subscription/usage gates.
- Operator controls required to operate provider connections, qualification policy, outreach templates, activation targets, and commercial limits.

## Explicit non-goals for the first migration

- Replacing Onlook's editor, AI engine, project model, or design system.
- Restructuring Onlook around donor Telio code, deprecating existing Onlook behavior, or editing protected original files without per-file confirmation.
- Selecting final Jagwar plans, prices, allowances, top-ups, or customer gates before representative end-to-end cost evidence exists.
- Reproducing the legacy Telio dashboard shell.
- Bulk campaign blasts or campaign analytics.
- Cold-email delivery infrastructure.
- Automatic publishing of third-party map/place photos without verified rights.
- Fabricating missing phone numbers, emails, addresses, ratings, hours, services, reviews, or business claims.
- Solving the long-term production-hosting provider before the business loop works.

## Success metrics

Primary measures:

- percentage of new users who uncover their first 5 leads;
- percentage who create 2 prospect projects;
- percentage who complete one compliant send;
- median time from signup to first published prospect project;
- previews sent → prospect replies → qualified opportunities → converted deals;
- first paying client and first meaningful monthly revenue reported by users.

Operational measures:

- discovery success, empty-result, timeout, and provider-failure rates;
- duplicate-candidate and duplicate-lead prevention rate;
- outreach compliance-block, queued, sent, delivered, and failed rates;
- project-publication association integrity;
- cost per discovered candidate, qualified pipeline lead, project, and completed send;
- cross-workspace data-access incidents: target zero.

Counter-metrics:

- Do not maximize raw lead count at the expense of relevance or provider cost.
- Do not maximize sends by weakening consent, suppression, or approved-template requirements.
- Do not count queued/failed sends as successful activation.
- Do not optimize fast project creation by fabricating facts or reducing output credibility.

## Product posture

The application should feel like a professional creative tool with a commercial operating layer, not a generic SaaS dashboard attached to an editor. New surfaces must use Onlook's tokens, typography, iconography, motion, focus behavior, density, and composition patterns. Jagwar-specific workflows should feel as if they were always part of Onlook.

The code should feel equally native: runnable surfaces live in the appropriate app, reusable capabilities in focused packages with public entry points, and route-specific components/hooks/tests remain colocated. Donor Jagwar implementation may be rewritten to achieve this standard. Existing Onlook behavior is preserved, and every original-file change requires explicit per-file approval.
