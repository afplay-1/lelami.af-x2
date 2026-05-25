# Security Specification & Threat Model (ABAC & Zero-Trust)

This document maps out the logical security gates, invariants, and adversarial payloads for the Lelami Marketplace Firebase structure.

## 1. Data Invariants

1. **User Profiles (`/users/{userId}`)**:
   - Only the authenticated user associated with `{userId}` can create or update their profile.
   - Profile updates must not escalate privileges or modify the user's `id`.
   - Creation requires `id`, `name`, and `phone` values.

2. **Listings (`/listings/{listingId}`)**:
   - Any authenticated user can create a listing, provided they are set as the `seller` and `sellerId` matches `request.auth.uid`.
   - Only the original creator (`sellerId == request.auth.uid`) can update or delete their listing document.
   - Relational check: Users cannot spoof the seller's identity on listing write operations.
   - Immutability: `sellerId` and `createdAt` cannot be modified once set.
   - Boundary checks: Title must be between 3 and 100 characters; price must be positive.

3. **Conversations (`/conversations/{conversationId}`)**:
   - A conversation can only be created by or read/updated by participants (`request.auth.uid in participantIds`).
   - `participantIds` list size must be exactly 2.
   - Users cannot edit others' unread counts arbitrarily.

4. **Chat Messages (`/conversations/{conversationId}/messages/{messageId}`)**:
   - Access is strictly gated by the parent conversation membership.
   - Message sender ID must match `request.auth.uid`.
   - Message status transitions must follow sequential bounds.

5. **Favorites (`/users/{userId}/favorites/{listingId}`)**:
   - Gated purely by ownership: Only user `{userId}` can read, write, or delete their favorites.

---

## 2. The "Dirty Dozen" Adversarial Payloads

Here are the 12 payloads representing security penetration scenarios which must always be rejected by the rules:

### Threat Variant 1: Identity Spoofing & Escalation
- **Payload 1**: Creating user profile with a different authenticated ID.
  - Attempt to write to `/users/victim_uid` with a request authenticated as `attacker_uid`.
- **Payload 2**: Overwriting the verified seller badge.
  - Normal user `attacker_uid` attempts to update their own profile to set `"isVerified": true`.
- **Payload 3**: Spoofing seller ID check in Listing.
  - `attacker_uid` submits listing to `/listings/new_listing` with `"sellerId": "victim_uid"`.

### Threat Variant 2: Out-Of-Bounds Values & Poisoning
- **Payload 4**: Submitting negative listing price.
  - Submitting listing payload with `"price": -99999`.
- **Payload 5**: ID Poisoning on document ID.
  - Attempting to write to `/listings/` with path variable `{listingId}` of size > 150 characters or special chars patterns.
- **Payload 6**: Mass-Data Injection.
  - Attempting to set standard text details to a string size > 50,000 characters to trigger memory or wallet exhaustion.

### Threat Variant 3: Relational Hijacking & Leakage
- **Payload 7**: Eavesdropping on a conversation.
  - Authenticated user `stalker_uid` attempts to read `/conversations/alice_and_bob` where `stalker_uid` is not in `participantIds`.
- **Payload 8**: Injecting messages as another user.
  - Authenticated user `malicious_uid` attempts to post message to `/conversations/alice_and_bob/messages/msg_1` with `"senderId": "alice_uid"`.
- **Payload 9**: Mass-Message Injection.
  - Adding unrequested/unvalidated metadata fields to conversation threads (e.g. nested settings flags) directly from SDK.

### Threat Variant 4: State Shortcutting & Immortals
- **Payload 10**: Transitioning listing seller.
  - `attacker_uid` tries to update a seller object in an existing listing.
- **Payload 11**: Overwriting immutable `createdAt` timestamp.
  - User attempts to rewrite listing doc with changed `"createdAt"` back-dated to 1 year ago.
- **Payload 12**: Unauthorized favorites writing.
  - Authenticated user `attacker` tries to save/delete favorites under `/users/victim_uid/favorites/some_listing`.

---

## 3. Test Script Outline (`firestore.rules.test.ts`)

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

// This outlines the validation structure to confirm all 12 adversarial payloads fail:
describe('Lelami Fortress Security Rules', () => {
  it('rejects identity spoofing on user creation', async () => {
    // Attempting to write to /users/victim with auth uid = 'attacker' should FAIL
  });

  it('rejects verification badge hijacking', async () => {
    // Action update to 'isVerified' by non-admin should FAIL
  });

  it('rejects listing spoofing of sellerId', async () => {
    // Attempting to list an ad with different sellerId should FAIL
  });

  it('protects private conversational threads', async () => {
    // Stalker trying to read alice and bob's conversation should FAIL
  });
});
```
