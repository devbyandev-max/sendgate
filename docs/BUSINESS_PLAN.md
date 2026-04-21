# SendGate — Business Plan

**Product:** Bring-Your-Own-SIM SMS gateway for the Philippines
**Stage:** MVP, pre-launch (hardware + software ready, Phase 8 polish remaining)
**Prepared:** 2026-04 · v1.0

---

## 1. Executive Summary

SendGate lets Philippine SMBs and developers send and receive SMS from **their own Globe / Smart / DITO numbers** without per-message fees. Customers ship us an active SIM; we host it in a managed hardware gateway (YX GP pool); they send and receive through a dashboard or REST API for a **flat ₱1,499 per SIM per month**.

We replace the two painful options Philippine businesses have today:
- **Per-message SMS APIs** (Semaphore, iTexMo, Twilio, Movider) — ₱0.50–₱3.00 per message, unpredictable monthly bills, messages delivered from random shortcodes customers don't recognize.
- **DIY Android phone + Macrodroid setups** — unreliable, no audit trail, no team access, breaks whenever the phone reboots.

**Why now.** OTPs, delivery notifications, and appointment reminders have become mandatory UX for every PH-facing web app, while the cost per message from aggregators keeps rising. A flat-rate option paid in pesos, using the customer's own number, is materially cheaper at >3,000 messages/month and structurally more trustworthy (the recipient sees a real PH mobile number).

**Target customer (launch).** Philippine SMBs and independent developers sending 3k–30k SMS/month: e-commerce shops, logistics startups, clinics, school systems, fintech side-projects, SaaS that need PH OTP/notifications.

**Traction plan (12 months).** 150 paying SIMs by end of month 12, ~₱225K MRR, gross margin ~60% after hardware amortization and line costs.

**Ask (if raising).** ₱3–5M seed to fund: 50 hardware ports of inventory, 2 hires (support + growth), 12 months runway, and the YX GP driver completion. Bootstrappable at smaller scale with founder capital + pre-orders.

---

## 2. Problem

### For SMBs
- **Bills they can't forecast.** Semaphore/iTexMo charge per message. A store running a ₱5,000 campaign one month and ₱40,000 the next can't budget.
- **Sender ID looks spammy.** Messages arrive from "SEMAPHORE" or a 5-digit shortcode; conversion and deliverability suffer.
- **No reply channel.** Aggregator shortcodes are one-way. Customers replying "STOP" or asking a question get nothing.
- **OTP cost at scale.** A 20k-user fintech sending 3 OTPs/user/month at ₱0.50 = ₱30K/month, much of it pure telco arbitrage.

### For developers
- **PH-specific APIs are clunky.** Docs inconsistent, no idiomatic SDKs, manual invoicing.
- **Twilio is priced in USD.** Volatile pesos-per-message, no PH billing.
- **Personal projects don't justify enterprise contracts** with Globe Labs/Smart.

### For everyone
- Existing BYO-SIM options are **Android phones running hobbyist apps** — unmonitored, single-user, and break the moment the phone's battery dies or Google Play services update.

SendGate is the **"managed phone plan for your software"**: keep your number, pay one flat fee, get an API and a dashboard, let someone else run the hardware.

---

## 3. Solution

A managed SIM-hosting service with a first-class software layer.

1. **Customer buys a SIM** (Globe, Smart, or DITO), loads a promo/plan of their choice, and mails it to SendGate.
2. **SendGate installs the SIM** in a YX GP multi-port gateway rack, assigns it to the customer's account, and marks it Active.
3. **Customer uses the number** via:
   - Web dashboard (single send, bulk, campaigns, scheduled, inbox/outbox, conversation threads, contacts)
   - REST API v1 with bearer auth
   - Webhooks for inbound + delivery events
4. **Customer pays ₱1,499/SIM/month** via bank transfer with uploaded proof (pre-PayMongo phase); admin approves → invoice marked paid.
5. **Everything else is SendGate's problem**: signal, gateway uptime, carrier changes, load balancing, storage, auditability.

The **customer's telco load/plan pays the per-message cost**. SendGate charges only for the service layer. That's the whole business model in one sentence.

---

## 4. Product (where we are today)

Status as of 2026-04 (see `docs/` and code):

**Shipping ✅**
- Customer auth incl. 2FA (Fortify)
- Customer dashboard: SIMs, send, inbox, outbox, scheduled, conversations, contacts, API keys, webhooks (config), billing
- Admin panel: customers, SIM lifecycle, payment-proof review, announcements, activity log
- Public REST API v1 with key auth + 60 req/min throttle
- Stub gateway driver (deterministic latency for dev / demo)
- Invoice generation + PDF + bank-transfer payment flow
- Marketing site: home, pricing, features, FAQ, docs

**Remaining before public launch (Phase 8)**
- Real **YX GP gateway driver** (the three methods in `YxGpGateway.php`)
- Inbound SMS polling job (depends on driver)
- **Webhook delivery worker** (model exists, dispatcher missing)
- **Email notifications** (welcome, payment approved/rejected, overdue, admin invite)
- **Campaign create wizard + CSV recipient import**
- PayMongo / GCash payment rail (optional v2)

Realistic cutover window: **4–6 weeks** of focused work once hardware is on hand.

---

## 5. Market

### Philippines SMS landscape

- ~117M population, 1.4x mobile SIM penetration (dual-SIM common).
- Three active mobile telcos: Globe, Smart (PLDT), DITO. All three offer "unlimited texts to all networks" promos in the ₱100–₱300/month range — **this is the supply of cheap outbound SMS that SendGate resells via the customer's own SIM**.
- The regulator (NTC) and SIM Registration Act (RA 11934, 2022) now require registered SIMs — which means every SIM hosted at SendGate must be registered to the **customer**, not SendGate. We do not own or mask the number. This is a positive for us: it keeps us out of telco-reseller territory and squarely in the "managed hosting for a phone your customer owns" model.

### Competitive landscape

| Segment | Examples | Model | Typical cost | Weakness vs SendGate |
|---|---|---|---|---|
| Aggregator APIs | Semaphore, iTexMo, PhilSMS, Movider | Per-message, shortcode sender | ₱0.50–₱1.00/SMS | Variable bills; not the customer's number; one-way |
| Global APIs | Twilio, MessageBird, Vonage | Per-message, USD billed | ₱2–₱3/SMS to PH | FX risk; no PH billing; deliverability complaints |
| Telco APIs | Globe Labs, Smart DevNet | Contract, per-message | Enterprise-only | High minimums; slow onboarding; not for SMBs |
| DIY Android | Macrodroid, SMS Gateway APK | One-off | "Free" + phone + electricity | Unreliable; single-user; no audit; breaks often |
| Hardware resellers | A few local shops selling GoIPs/YX GP | Hardware sale | ₱40k–₱120k upfront | Customer runs ops themselves |

**SendGate's slot.** Between DIY Android (too fragile) and telco enterprise (too heavy). Fixed-fee, customer's own number, developer-grade API, Philippine peso billing, no minimums.

### Addressable demand (conservative, bottom-up)

- Philippine e-commerce stores on Shopify + Shopee + Lazada: ~120k active (2025 est.).
- Registered fintechs / e-money issuers using SMS OTP: ~60 at scale + thousands of small.
- Local SaaS/dev shops sending transactional PH SMS: unknown but >5k based on Semaphore + PhilSMS public case lists.
- Appointment-based businesses (clinics, salons, schools): hundreds of thousands.

We do not need TAM fantasy numbers. If we convert **0.1% of PH e-commerce stores alone** in 24 months, that's **120 paid SIMs** — roughly our year-1 target.

---

## 6. Customer Segments (Launch ICP)

**Primary: "SMBs & developers sending 3k–30k SMS/month."**

Three beachhead personas:

**A. The e-commerce operator.** 1 staff member, 500–5,000 orders/month, sends dispatch + COD confirmation + abandoned-cart SMS. Currently pays Semaphore ~₱5k–₱15k/month. Break-even vs SendGate at ~3,000 messages.

**B. The indie developer / micro-SaaS builder.** Running a PH-focused product (an inventory app, a clinic booking app, a church management tool) that needs OTPs and reminders. Semaphore's monthly bill is unpredictable; Twilio is in dollars. Wants a flat line item and an API.

**C. The BPO / small logistics startup.** 5–20 couriers, each dispatch triggers 2–3 SMS to the customer. 10k–25k SMS/month. The phone-based DIY rig they're using crashes weekly.

**Not our ICP at launch:** banks, enterprise BPOs (would need SLAs + dedicated infrastructure), SMS marketing blasters needing 500k+/month (regulatory + carrier-throttling risk), overseas-based companies (FX + billing friction).

---

## 7. Business Model

### Revenue streams

1. **Flat monthly subscription: ₱1,499 per SIM per month.** Includes hosting, dashboard, API, unlimited messages up to the telco's cap, support, and audit logs.
2. **One-time SIM activation: ₱499** (covers intake, registration check, gateway slot allocation). Waived on annual prepay.
3. **Future (v2): PayMongo + GCash rails, priority support tier, SIM concierge (we buy/register on the customer's behalf under their name with RA 11934 compliance).**

### Pricing rationale

- Break-even vs Semaphore at ₱1,499 ÷ ₱0.50 = **~3,000 SMS/month**. Any customer above that volume saves money from month one; below that, they're paying for reliability + own-number + API.
- Price is in pesos, no FX tax, predictable line item for CFOs.
- 10%+ gross margin even at worst-case telco load cost (see unit economics).

### Billing mechanics (MVP)

- Invoice generated monthly by `GenerateInvoicesJob`, due 14 days later.
- Customer uploads bank-transfer proof in dashboard → admin approves → invoice marked paid.
- Overdue > 14 days: service paused (not yet automated — manual for MVP); > 45 days: SIM returned to customer or disposed of per ToS.

### Contract structure

- Month-to-month by default.
- **Annual prepay: 2 months free** (₱1,499 × 10 = ₱14,990/SIM/yr) — strong LTV lever once we have case studies.

---

## 8. Unit Economics (per SIM, steady state)

All figures in PHP. Assumptions labeled; real values firm up after 30 paying customers.

| Line | Amount | Notes |
|---|---:|---|
| **Revenue** | | |
| Monthly subscription | 1,499 | flat |
| **COGS** | | |
| Telco load (customer pays) | 0 | customer tops up their own SIM |
| Gateway hardware amortization | 140 | YX GP 32-32 @ ~₱105k ÷ 25 active SIMs (with headroom) ÷ 30-mo useful life ≈ ₱140 |
| Colocation + power per SIM | 40 | rack + UPS + internet share |
| Server infra (Laravel Cloud + DB + storage) | 90 | @ ₱3K/mo ÷ ~35 customers early; drops to ₱15/SIM at scale |
| Payment ops (manual proof review) | 30 | ~5 min admin time per invoice |
| Carrier/NTC compliance overhead | 20 | registration checks, audit time |
| **Gross COGS** | **320** | |
| **Gross profit per SIM / month** | **1,179** | **~79% gross margin at scale**; ~55–60% at launch under-utilized capacity |
| **CAC assumption (launch)** | 700 | mix of organic + ₱500 referral + ~2h sales touch |
| **Payback** | 0.6 months | CAC / gross profit |
| **12-month LTV (assume 10% monthly churn early, declining)** | ~9,400 | geometric sum, conservative |
| **LTV : CAC** | ~13× | healthy |

Sensitivities:
- Churn is the biggest unknown. Every +1% monthly churn drops 12-month LTV by ~₱500.
- If we offer the ₱500/SIM referral in perpetuity, CAC effectively floors at ₱600.
- Infra per-SIM cost falls fast with scale; at 300 SIMs it's ~₱20/SIM.

---

## 9. Go-to-Market

### Launch sequence (first 90 days)

**Weeks 1–2 — Hardware + driver cutover.**
- YX GP driver wired and load-tested with 8 SIMs.
- First 8 paying "design partners" onboarded at 50% off for 3 months in exchange for testimonials and bug reports.

**Weeks 3–6 — Content + developer outreach.**
- Ship 4 technical blog posts: "PH SMS OTP for ₱0.05 per message", "Why your Semaphore bill is unpredictable", "Building an SMS gateway with Laravel", "Comparing Semaphore, Twilio, and SendGate for PH startups".
- Docs site polished; Postman collection + example repos (Laravel, Next.js, Python).
- Targeted outreach to 50 PH indie hackers on Twitter/X, FB groups (Philippine Laravel Devs, PinoyDev, Grow PH), Reddit r/phclassifieds + r/buhaydev.

**Weeks 7–12 — Paid + partnership.**
- ₱30k/mo in Facebook/Meta ads targeting PH e-commerce operators (lookalike of Semaphore customers not possible — use interest targeting: "Shopify", "Lazada seller", "Shopee seller").
- Partnership outreach to:
  - PH e-commerce tool vendors (Sprout CRM, Sanity eCommerce) — referral fee per referred SIM.
  - PH Laravel / Vue / React agencies (Kodego, Prosperna) — white-label / reseller.
  - Logistics startups (Lalamove alternatives, last-mile couriers) — bulk deal.

### Channels, ranked by expected efficiency

1. **Direct developer outreach + content.** Highest-intent, lowest-CAC. Developers *already know* they're overpaying Semaphore.
2. **Partnerships with PH dev agencies.** They manage client SMS; swapping in SendGate is a margin win for them.
3. **Facebook groups and communities.** PH SMB owners are heavily on FB.
4. **Paid FB + Google ads.** Works but burns fast without strong landing pages.
5. **SEO.** Long-term; "semaphore alternative philippines", "cheap PH SMS API" — start ranking by month 9.

### Retention

- Treat payment-proof review as a support touchpoint — reply to every proof upload.
- Monthly usage email: "You sent X messages, saved ₱Y vs Semaphore."
- Fast support: Discord / Viber community; 4-hour response SLA on business days.

---

## 10. Operations

### Physical infrastructure

- One rack, colocated in Metro Manila (Globe Atrium IX or ePLDT VITRO; 4U slot ~₱8k/mo).
- **YX Series GP multi-port GSM/WCDMA/LTE gateways** from YX International (yxinternet.com). See §10a for full hardware detail.
- Redundant broadband (PLDT + Converge fail-over) — all traffic to the gateways must egress through a carrier-grade IP block; residential/consumer IPs look suspicious to telcos.
- UPS + monitoring (SNMP on the gateway itself, Prometheus on the controller).

### 10a. Hardware Platform — YX Series GP

**What it is.** A rack-mountable multi-port GSM/CDMA/WCDMA/LTE gateway. Each "channel" is a radio module that hosts one live SIM; each "slot" is a physical SIM tray. Some models bank multiple SIMs per channel and rotate them — we do **not** use that mode (see config discipline below).

**Model options and SendGate mapping** (prices approximate, confirm with supplier — YX International or PH resellers; USD list prices converted at ₱56:1):

| Model | Channels (live SIMs) | SIM slots | Our use case | Indicative price |
|---|---:|---:|---|---:|
| YX GP 4-4 | 4 | 4 | Pilot / bench unit | ₱22–28k |
| YX GP 8-8 | 8 | 8 | First deployment, design partners | ₱35–45k |
| YX GP 16-16 | 16 | 16 | Month 3–6 expansion | ₱55–70k |
| YX GP 32-32 | 32 | 32 | Month 6–12 expansion, primary unit | ₱90–120k |
| YX GP 16-128 / 32-512 | 16–32 | 128–512 | **Do not use** — SIM-banking variants designed for rotating numbers; incompatible with our "always-on, your-number" promise | n/a |

**SendGate standardizes on the 1-SIM-per-channel variants (4-4, 8-8, 16-16, 32-32).** Every customer SIM gets a dedicated radio; no rotation, no sharing.

**Physical specs (per unit).**
- 1× WAN RJ-45 (10/100BASE-T), 1× USB console
- DC 12V, 3–8A depending on size; 100–240VAC brick
- 0–50°C operating range, 10–90% RH
- 12-month manufacturer warranty

**Interfaces we actually use (from the V5.1.5 manual):**

| Interface | Direction | Purpose in SendGate |
|---|---|---|
| `POST /GP_post_sms.html` (JSON) | Outbound | Send SMS — batches of tasks, returns per-task status codes |
| `GET /GP_send_sms.html` | Outbound (fallback) | Single-shot send, used only for debugging |
| `GET /GP_get_sms.html` | Inbound (poll) | Emergency/backup path for fetching received SMS if the forward path is down |
| **SMS-to-HTTP Forward** | Inbound (push) | **Primary inbound path** — device POSTs every received SMS to `https://sendgate.ph/api/internal/yxgp/inbound`. Eliminates polling. |
| `GET /GP_send_ussd.html` | USSD | Carrier balance + number-registration checks (`*143#` Globe, `*123#` Smart, `*123#` DITO) |
| SMPP 3.4 | Optional | Not used at launch; keep as future option for aggregator partners |
| SNMP | Monitoring | Port uptime, signal strength, SIM status into our ops dashboard |
| Web UI on port 80 | Ops only | Provisioning new SIMs, firmware updates — never exposed publicly |

**Capacity planning.**
- Each channel (radio) supports one SIM at ~6 SMS/second sustained, more in bursts.
- Concurrent capacity is the channel count, not the slot count.
- 32-32 unit = 32 paying customer SIMs per unit. We target ~25 active customers per unit (headroom for bursts, maintenance, and re-provisioning).
- **Procurement schedule:** 1× 8-8 at launch → upgrade to 1× 32-32 by M3 → add a 2nd 32-32 by M9. Retire smaller units to a hot-spare shelf.

**Config discipline — features we explicitly disable.** The YX GP ships with a set of "anti-block" features oriented at gray-route termination operators. We are not that business and must turn them off at every deployment. Runbook:

| Manual feature | Action | Why |
|---|---|---|
| SIM Pool / SIM rotation between ports | **Off** | Every customer's number must always be on the same slot. Rotation breaks the core promise. |
| IMEI randomization / IMEI group ranges | **Off / fixed IMEI per slot** | IMEI churn is a telco fraud signal, and we have nothing to hide. |
| Port Inter-Calling (§7.13) | **Off** | Synthetic inter-SIM calls are pure fraud-evasion; irrelevant to SMS use. |
| Fake Ring back, FAS shield | **Off** | Voice-termination features; we don't do voice at all. |
| "Proxy Encryption Solution for IP Block" | **Off** | Same reason. |
| Dial Plan / Prefix outbound routing | **Off** | We don't do voice. |
| Scheduled SMS on-device | **Off** | SendGate's own scheduler owns this so we have audit + UI. |
| SMS Filter (spam) | **On** | Keep inbox clean of telco marketing to the hosted SIM. |
| VPN (PPTP) out to controller | **On** | Management plane encrypted. |
| Status Notification push | **On → `/api/internal/yxgp/status`** | Real-time device + port state into our admin dashboard. |

This configuration is documented as the **SendGate YX GP Operations Runbook** (separate ops doc). Every unit racked must pass a runbook checklist before any customer SIM goes in.

**Firmware note.** V5.1.5 (Jan 2022) is the manual version on hand; check for newer releases from YX NOC quarterly. Upgrades are TFTP/HTTP from the web UI — take the unit out of rotation, snapshot config, upgrade, verify, put back.

### Staffing (month 0–12)

- **Founder(s)** — product, code, first-line support, hardware ops.
- **Customer support / operations hire (month 3–4).** Reviews payment proofs, onboards SIMs, answers tickets. ~₱30–40k/mo.
- **Growth hire (month 6–9).** Content + community + partnerships. ~₱40–60k/mo.
- Back-office (bookkeeping, BIR) outsourced.

### Compliance

- **NTC / RA 11934 (SIM Registration Act).** Every SIM hosted remains registered to the customer; we require registration proof at intake. We keep copies of the registration screenshots in the customer file. This is a **feature, not a liability** — we are not a reseller of airtime.
- **Data Privacy Act (RA 10173).** Register SendGate Philippines, Inc. with the NPC. Privacy policy already in place (marketing site). Encrypt PII at rest; message bodies are already stored per customer scope.
- **BIR.** Register as corporation; VAT registration at ₱3M revenue threshold; issue official receipts. Bookkeeping from month 0.

### Support model

- Email + in-app chat (Viber business link at launch; Intercom at scale).
- Status page.
- 4-hour response on business days, 24-hour on weekends.
- Escalation tier for hardware issues (on-call founder/ops lead).

---

## 11. Product Roadmap (12-month)

| Quarter | Theme | Key deliverables |
|---|---|---|
| **Q1 (0–3 mo)** | Launch hardening | YX GP driver (POST `/GP_post_sms.html` for send, device-side SMS-to-HTTP forward for inbound, USSD for balance); config runbook + ops checklist; webhook delivery worker; email notifications; CSV campaign import; first 20 paying SIMs |
| **Q2 (3–6 mo)** | Developer delight | Official SDKs (PHP, JS/TS, Python); self-serve API key scopes; webhook signing docs; better metrics; **50 paying SIMs** |
| **Q3 (6–9 mo)** | Payments + growth | PayMongo / GCash rails; annual-prepay upsell; referral program automation; SEO content flywheel; **100 paying SIMs** |
| **Q4 (9–12 mo)** | Teams + scale | Multi-user accounts (team roles); number pools ("send from any of my 5 SIMs"); priority-support tier; SLA option; **150 paying SIMs**; begin Q1-next-year planning for SEA expansion |

---

## 12. Financial Projection (12-month, conservative)

All figures in PHP. Assumes month-0 start with 8 design-partner SIMs already paying.

| Month | New paid SIMs | Total paid SIMs | MRR | Cumulative revenue | Monthly burn | Cash position* |
|---:|---:|---:|---:|---:|---:|---:|
| M1 | 4 | 12 | 18,000 | 18,000 | 180,000 | -162,000 |
| M2 | 6 | 18 | 27,000 | 45,000 | 180,000 | -297,000 |
| M3 | 8 | 26 | 39,000 | 84,000 | 200,000 | -458,000 |
| M4 | 10 | 36 | 54,000 | 138,000 | 220,000 | -624,000 |
| M5 | 12 | 48 | 72,000 | 210,000 | 220,000 | -772,000 |
| M6 | 14 | 62 | 93,000 | 303,000 | 240,000 | -919,000 |
| M7 | 16 | 78 | 117,000 | 420,000 | 250,000 | -1,052,000 |
| M8 | 16 | 94 | 141,000 | 561,000 | 260,000 | -1,171,000 |
| M9 | 18 | 112 | 168,000 | 729,000 | 270,000 | -1,273,000 |
| M10 | 12 | 124 | 186,000 | 915,000 | 280,000 | -1,367,000 |
| M11 | 13 | 137 | 206,000 | 1,121,000 | 290,000 | -1,451,000 |
| M12 | 13 | 150 | 225,000 | 1,346,000 | 300,000 | -1,526,000 |

\* Cash position assumes ₱0 starting capital. **Peak cash need ≈ ₱1.55M**, reached around month 12. Break-even crosses around **month 16–18** under current assumptions (MRR exceeds burn as burn flattens and MRR compounds).

Key assumptions baked in:
- Churn: 10%/mo in Q1, 7% Q2, 5% Q3, 4% Q4 (churn netted out of "new paid SIMs" numbers).
- Burn = founder stipend (₱80k) + 1 ops hire from M3 (₱40k) + 1 growth hire from M6 (₱50k) + rack + infra + ads.
- Ads budget ramps from ₱0 to ₱40k/mo over the year.
- Hardware capex (not in monthly burn, amortized through COGS): 1× YX GP 8-8 at launch (~₱40k), 1× YX GP 32-32 at M3 (~₱105k), 1× YX GP 32-32 at M9 (~₱105k). Total capex year 1 ≈ **₱250k**. Spare parts + antennas + PSUs add ~₱30k.

**Raise scenario.** A ₱3M seed covers the ₱1.55M peak cash + ₱280k hardware capex with ~9 months of runway buffer. A ₱5M round funds 2 additional hires and a more aggressive ads + content budget, pulling break-even in by ~3 months.

---

## 13. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Telco blocks our gateway IP/ports** | Medium | High | Spread SIMs across Globe/Smart/DITO; don't exceed consumer-plan fair-use; customer owns the SIM so blocks are per-SIM, not systemic. Maintain telco contacts. |
| **Telco fraud-detection flags YX GP device fingerprint** | Medium | High | The YX GP was designed in large part for gray-route VoIP termination; telcos may recognize its radio signature or IMEI patterns. Mitigation: disable every anti-block feature (SIM rotation, IMEI randomization, port inter-calling, fake ringback) per the §10a config runbook; keep the factory IMEI per slot; operate within consumer-plan send rates (≤ 6 SMS/sec/SIM, ≤ 2,000 SMS/day/SIM as an opening ceiling); pre-emptive conversation with telco enterprise teams that we are a hosting provider, not a grey-route operator. |
| **Per-SIM rate limits from carriers** | High | Medium | Globe / Smart / DITO apply soft anti-spam thresholds (typ. a few hundred SMS/hour to unique recipients). Enforce per-SIM daily caps in `SendSmsJob`; expose a "burst mode" only to customers who sign an AUP; auto-throttle before the carrier does. |
| **Hardware failure (rack outage)** | Medium | Medium | Redundant broadband, UPS, hot-spare 8-8 unit on-site, cold-spare PSUs + antennas. Status page; SLA commitments start only in Q4. YX warranty is 12 months — maintain vendor support contract for year 2+. |
| **YX firmware vulnerability** | Low | High | YX GP firmware (V5.1.5+) has a default `root/root` login and exposes HTTP on port 80. Mitigations: gateways live on a private VLAN, never a public IP; admin plane reached via VPN only; default password rotated at provisioning; firmware quarterly review + apply. |
| **SIM Registration Act enforcement changes** | Low | High | Already compliant: customer-registered SIMs. Legal counsel on retainer. |
| **Payment disputes / chargebacks** | Low | Low | Bank transfer + proof = no chargeback risk. PayMongo added only post-product-market-fit. |
| **Semaphore / iTexMo price cut to match** | Medium | Medium | Our moat is "your own number + flat fee", not price alone. Compete on trust, not pricing leaflet. |
| **Global entrant (Twilio localized PH)** | Low | Medium | Twilio PH pricing would still be per-message. Different customer. |
| **Data breach / leaked message bodies** | Low | Very High | Encrypted at rest + TLS in transit + audit log + row-level scoping (already implemented in code). NPC registration + incident response plan. |
| **Customer uses us for SMS spam / scams** | Medium | High | Terms of service with clear prohibitions; anomaly monitoring on volumes + recipient uniqueness; kill-switch per SIM; mandatory opt-out handling for marketing messages. |
| **Fortify / Laravel / framework CVE** | Low | Medium | Keep stack current; Dependabot; security advisory subscription; auto-deploy patches. |
| **Founder capacity bottleneck** | High | Medium | Hire ops by M3, growth by M6; document runbooks; never single-person-on-call. |

---

## 14. Milestones (go/no-go)

- **M3:** 25 paying SIMs, <10% churn, 1 public case study. *No-go signal:* <10 SIMs or churn >20%.
- **M6:** 60 paying SIMs, ₱90k MRR, first referral-sourced sign-up. *No-go signal:* MRR growth <20% MoM for 2 consecutive months.
- **M12:** 150 paying SIMs, ₱225k MRR, 3 case studies, 1 channel partnership live. *Signal to raise Series A or grow organically:* LTV:CAC >10× **and** churn <5%/mo.

---

## 15. Appendix A — Legal & Corporate

- **Entity:** SendGate Philippines, Inc. (SEC-registered domestic corporation).
- **Core registrations:** SEC, BIR, Barangay & Mayor's permit, SSS/PhilHealth/Pag-IBIG for employees, NPC (Data Privacy) registration at 250 data subjects, NTC advisory.
- **IP:** All code proprietary; trademark "SendGate" filed with IPOPHL under Classes 38 (telecom) and 42 (software).

## 16. Appendix B — Glossary

- **BYO-SIM** — Bring Your Own SIM. The customer buys, registers, and owns the SIM; SendGate only hosts it.
- **YX GP** — A family of multi-port GSM gateways (also called GoIPs) that host physical SIMs and expose an HTTP/SMPP API.
- **Stub gateway** — Development-only driver that simulates message delivery (used in MVP + tests; see `app/Services/Gateway/StubGateway.php`).
- **MRR** — Monthly Recurring Revenue.
- **CAC / LTV** — Customer Acquisition Cost / Lifetime Value.
- **RA 11934** — Philippine SIM Registration Act of 2022.

---

*This plan is a living document. Re-baseline numbers quarterly against actual churn, CAC, and conversion data.*
