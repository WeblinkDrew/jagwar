# Lead Inbox Specification

## Purpose

Define lead-linked conversations, inbound and reply behavior, unread state, notifications, and outbound actor audit. This capability depends on workspace authority, lead identity, and Telnyx event authenticity; replies additionally depend on SMS outbound gates and balance.

## Requirements

### Requirement: Inbox is workspace- and lead-linked

The system MUST persist conversations and messages under one workspace and link replies to an authoritative lead when identity correlation is available. Active Owners and Members MUST be permitted to read Inbox and reply subject to outbound SMS authority. Cross-workspace conversation access MUST be denied.

#### Scenario: Member opens a lead conversation

- GIVEN an active Member belongs to the conversation's workspace
- WHEN the Member opens Inbox
- THEN the lead-linked message history MUST be available without exposing another workspace's data

### Requirement: Inbound may be recorded while outbound approval is pending

If Telnyx delivers authenticated inbound traffic to an already-assigned workspace number while registration or sender approval is pending, Inbox MAY record and display it. Outbound replies MUST remain blocked until all sender, compliance, entitlement, and balance gates pass.

#### Scenario: Inbound arrives during pending approval

- GIVEN Telnyx authenticates an inbound message to the workspace sender while outbound approval is pending
- WHEN the event is processed
- THEN Inbox MAY persist and display the message
- AND reply submission MUST remain blocked

### Requirement: Replies reuse confirmed SMS authority

An Inbox reply MUST use the SMS template/rendering rules where applicable, show a rendered preview and usage estimate, require explicit confirmation, and enforce line type, consent, opt-out, sender approval, entitlement, and balance server-side. UI availability MUST NOT authorize sending.

#### Scenario: Member confirms an eligible reply

- GIVEN the conversation is lead-linked and every SMS gate passes
- WHEN the Member confirms the rendered reply
- THEN one outbound message MUST be submitted and the Member MUST be recorded as actor

#### Scenario: Opt-out arrives before confirmation

- GIVEN a reply preview exists and an authoritative opt-out is recorded before confirmation
- WHEN the Member confirms
- THEN sending MUST be blocked without debit

### Requirement: Message events, unread state, and notifications are idempotent

This capability MUST own conversation, message, participant linkage, unread state, and notification-delivery evidence. Duplicate provider events or retries MUST NOT duplicate messages, unread counts, notifications, or analytics. Concurrent reads and arrivals MUST resolve without losing the durable message.

#### Scenario: Inbound webhook is delivered twice

- GIVEN an inbound provider message identity was persisted
- WHEN the same authenticated event arrives again
- THEN Inbox MUST retain one message and MUST NOT increment unread state twice

### Requirement: Message and actor evidence is secure and auditable

Outbound records MUST retain the acting member; inbound and status records MUST retain authenticated provider identity and timestamps. Sensitive provider credentials MUST NOT be stored in message content or exposed to members. Retention and deletion MUST follow the publishing/hosting lifecycle retention contract without removing legally retained audit evidence prematurely.

#### Scenario: Conversation is reviewed for audit

- GIVEN an authorized Owner reviews a workspace conversation
- WHEN audit evidence is requested
- THEN message direction, actor or provider source, status, and timestamps MUST be traceable without revealing provider secrets
