---
name: maintain-hummers-app
description: Continue, verify, and document development of the mobile-first Hummers app PWA in this repository, including its mocked KYC, asset, credit, merchant, admin, and payment flows.
metadata:
  short-description: Maintain the Hummers app MVP
---

# Hummers app project skill

Use this skill whenever changing, diagnosing, reviewing, or running the Hummers app in this repository. Treat this file as maintained project context, not as a substitute for the user's current request.

Before changing a business flow, service boundary, mock contract, or acceptance scenario, read [`docs/service-analysis-and-decisions.md`](docs/service-analysis-and-decisions.md). It preserves the question/answer history, rationale, superseded decisions, service ownership, acceptance scenarios, and unresolved items. Do not load it for a trivial styling or typo-only change.

## Product boundaries

- The product name is **Hummers app** and the current folder name `Supperapp` should remain unchanged unless a concrete technical problem requires otherwise.
- Build a mobile-first, responsive PWA. A dedicated desktop experience is not currently required.
- Follow the visual language and fonts of `C:\My Space\Hummers\leasing-backoffice-front`. The active font family is Dana FaNum from `public/fonts`.
- Use `C:\My Space\Hummers\hummers-app-front` as the reference for existing customer flows.
- The leasing service reference is `C:\My Space\Hummers\leasing-backoffice`. External services and the backend remain mocked in this MVP.
- Persist demo state in the browser through IndexedDB. Do not add SQLite unless a later requirement establishes a concrete need.
- Do not add unit, integration, E2E, or Docker work until the user requests the next maturity phase. Continue to run lint and production build after material code changes.

## Domain decisions

### Authentication and KYC

- Login uses mobile number and OTP. The demo OTP is `12345`.
- Users under 18 must be rejected. Level-one KYC must check ownership matching between national ID and mobile.
- Level one first checks Sejam. If Sejam has no record, collect national ID and birth date and use the mocked civil-registry/mobile-owner path. If a service is unavailable, show an error instead of silently accepting data.
- Level two captures the national-card photo with the rear camera and the face photo plus live video with the front camera. File upload or gallery selection is forbidden; use live `getUserMedia`/`MediaRecorder` capture only.
- Level-two data is sent to the mocked Finnotech endpoint for face and liveness matching.
- Camera access on a phone requires a secure context. Use HTTPS for mobile testing.
- The home page must show the user's KYC level and direct incomplete users to KYC. Users below level one cannot purchase an asset or request credit.

Demo identities:

- Customer: `09120000001`
- Merchant: `09120000002`
- Admin: `09120000003`
- Customer without Sejam/KYC: `09121112233`
- National ID `1111111111` triggers the mocked “not found in Sejam” fallback.
- National ID `9999999999` triggers the mocked unavailable-service response.

### Assets and payment

- Current asset products are the Hummers Simorgh fund and Hummers gold-backed life insurance. Prices/NAV and similar values are configurable mock values until real values are supplied.
- Asset issuance is asynchronous and normally takes one or two days. Polling/back-office confirmation determines the final result.
- Asset purchase redirects to the simulated Saman/SEP payment page. Only after a successful mocked payment and return to Hummers may the purchase/issuance request be created.
- The cash portion of an invoice is informational and is settled outside this system.

### Credit and collateral

- Credit is at most 70% of collateral value. Available asset value is current value minus blocked value.
- Applying for credit blocks the customer's assets. Before the first purchase, the customer may cancel and release all collateral.
- On the first purchase, unused credit is cancelled immediately and excess collateral is released.
- A credit case stays in initial status until a purchase. After purchase it is finalized and sent through three leasing evaluators, then becomes a facility contract. Requests are not rejected in this flow.
- Installment schedules, penalties, and overdue calculations belong to the leasing system and are only displayed here.
- Admin overdue recovery is manual: filter the report, inspect assets, select one, and withdraw exactly the overdue installment plus penalty—never more.

### Merchant and admin

- A merchant invoice may contain multiple items, quantities, discounts, and taxes. The customer must see and approve the complete invoice.
- Merchants manage products and stock for future online sales.
- Merchant wallet shows sold, pending-settlement, and settled amounts by date range. There is no rejected settlement status.
- Admin capabilities live inside this app under role-based access and include users, shops, plan activation, asset issuance outcomes, credit evaluations, settlements, and overdue recovery.
- Credit plans originate from leasing `PROGRAM` data and only plans flagged for Hummers app exposure are shown.

## UI and numeric conventions

- Use Persian, RTL, mobile-first layouts and display money in تومان unless an external screen requires ریال (for example, the SEP gateway).
- Group monetary and count inputs in three-digit groups while typing. Do not group identifiers such as mobile, OTP, national ID, card number, or dates.
- Preserve the existing Dana FaNum typography, theme tokens, bottom navigation, and maximum mobile canvas width unless the current request explicitly changes the design system.

## Important implementation locations

- App state and mocked domain operations: `contexts/AppContext.tsx`
- Domain types and initial demo state: `lib/types.ts`, `lib/mock-data.ts`
- IndexedDB persistence: `lib/storage.ts`
- KYC UI and live camera capture: `app/kyc/page.tsx`, `components/LiveCameraCapture.tsx`
- Home/KYC status: `app/home/page.tsx`
- Asset purchase and payment return: `app/assets/buy/page.tsx`, `app/payment/saman/page.tsx`, `app/payment/result/page.tsx`
- Mock endpoints: `app/api/mock`
- App shell and role routing: `components/AppShell.tsx`
- Fonts/theme: `app/layout.tsx`, `app/theme.ts`, `public/fonts`

## Running and verification

Normal LAN development:

```powershell
npm run dev
```

HTTPS development for phone camera testing:

```powershell
npm run dev:https
```

The app uses port `3010` and binds to `0.0.0.0`. At the time of this update, the Wi-Fi address is `192.168.20.223`, but always re-check it with `ipconfig` instead of assuming it is stable. HTTPS development certificates are generated under the ignored `certificates` directory. A phone may require accepting or installing the development CA before the browser treats the origin as secure and enables camera/microphone APIs.

After material changes, run:

```powershell
npm run lint
npm run build
```

Restart the dev server after a production build when the user is actively reviewing the live app.

## Maintenance rule for this skill

Keep this file synchronized with the implementation. Review and update it:

- after completing a meaningful feature or changing a domain decision;
- when routes, demo identities, mock scenarios, run commands, security requirements, or key file locations change;
- before handing off a substantial milestone if several small changes accumulated.
- whenever analysis with the product owner resolves an ambiguity; record the detailed discussion and rationale in `docs/service-analysis-and-decisions.md`, then keep only the current operational rule here.

Do not rewrite this file for trivial styling or typo-only edits. Prefer concise corrections over appending a chronological changelog. Preserve historical and superseded decisions in the analysis document rather than bloating this entrypoint. The implementation and the user's latest explicit instruction remain authoritative if either document becomes stale; when a mismatch is found, fix the implementation as requested and then update both documents in the same change set.
