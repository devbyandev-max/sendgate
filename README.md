# SendGate

A production-ready Bring-Your-Own-SIM SMS gateway SaaS for the Philippines, built on Laravel 13 + Inertia + React.

Customers ship their active Philippine SIM (Globe / Smart / DITO) to SendGate, where it lives in our hardware gateway. They then send and receive SMS from that number through a clean dashboard or REST API for ₱1,499/SIM/month — flat, no per-message fees.

---

## Stack

- **Laravel 13** + **PHP 8.4**
- **Inertia.js v3** + **React 19** + **TypeScript** (Vite + React Compiler enabled)
- **Tailwind CSS v4** (with `@theme` in `resources/css/app.css` — emerald brand)
- **Laravel Fortify v1** for authentication (login, register, password reset, email verification, 2FA)
- **Laravel Wayfinder v0** for typed frontend route helpers
- **spatie/laravel-permission** for RBAC (customer / admin / super_admin)
- **spatie/laravel-activitylog** for audit logging
- **barryvdh/laravel-dompdf** for invoice PDFs
- **league/csv** for CSV imports
- **Pest v4** for testing
- **SQLite** in dev (swap `DB_CONNECTION` for production)

---

## Quick start (local development)

Requires PHP 8.4, Composer, Node 20+, and [Laravel Herd](https://herd.laravel.com).

```bash
# 1. Install dependencies
composer install
npm install

# 2. Configure environment
cp .env.example .env
php artisan key:generate

# 3. Build the database with demo data
php artisan migrate:fresh --seed

# 4. Build the frontend (regenerates Wayfinder helpers + bundles)
npm run build

# 5. Start everything (Vite, queue worker, log streamer, php server)
composer run dev
```

The site is served by Herd at <http://sendgate.test>.

### Demo credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | `admin@sendgate.ph` | `password` |
| Customer (populated) | `demo@example.com` | `password` |
| Customer (empty) | `demo2@example.com` | `password` |

Demo customer 1 has 1 active SIM, 50 sample SMS, 1 paid + 1 pending invoice, 3 contacts, and 1 API key seeded.

---

## Architecture overview

```
┌───────────────────────────────────────────────────────────────────┐
│                          Marketing Site                           │
│   /, /pricing, /features, /faq, /docs, /terms, /privacy           │
│   Layout: resources/js/layouts/marketing-layout.tsx               │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────┐         ┌──────────────────────────────┐
│   Customer Dashboard  │         │       Admin Panel            │
│   /app/* (auth+role)  │         │       /admin/* (role gate)   │
│                       │         │                              │
│   • Dashboard         │         │   • Dashboard (KPIs)         │
│   • SIMs              │         │   • Customers                │
│   • Send SMS          │         │   • SIMs (assign, activate)  │
│   • Inbox / Outbox    │         │   • Messages (global log)    │
│   • Scheduled         │         │   • Invoices                 │
│   • Campaigns         │         │   • Payment review           │
│   • Contacts          │         │   • Analytics                │
│   • Analytics         │         │   • Announcements            │
│   • API keys          │         │   • Admins                   │
│   • Webhooks          │         │   • Settings                 │
│   • Billing           │         │   • Activity logs            │
└───────────┬───────────┘         └──────────────┬───────────────┘
            │                                    │
            └──────────────┬─────────────────────┘
                           ▼
              ┌────────────────────────┐
              │   Public REST API v1   │
              │   /api/v1/*            │
              │                        │
              │   Bearer sg_live_… key │
              │   60 req/min throttle  │
              │                        │
              │   • POST /messages     │
              │   • GET  /messages     │
              │   • GET  /sims         │
              │   • POST /contacts     │
              │   • GET  /account      │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  GatewayInterface      │
              │  (app/Services/        │
              │   Gateway/)            │
              ├────────────────────────┤
              │  • StubGateway   (dev) │
              │  • YxGpGateway   (TODO)│
              └────────────────────────┘
```

### Key directories

```
app/
├── Actions/Fortify/        Custom Fortify actions (CreateNewUser assigns customer role)
├── Enums/                  All status enums (SimStatus, InvoiceStatus, MessageStatus, …)
├── Http/
│   ├── Controllers/
│   │   ├── App/            Customer dashboard controllers
│   │   ├── Admin/          Admin panel controllers
│   │   ├── Api/V1/         Public REST API controllers
│   │   └── Marketing/      Public site controllers
│   ├── Middleware/         EnsureUserRole, AuthenticateApiKey, HandleInertiaRequests
│   └── Responses/          LoginResponse, RegisterResponse (route-aware redirects)
├── Jobs/                   Queue-backed work (SendSms, SimulateDelivery, GenerateInvoices, …)
├── Models/                 15 Eloquent models with relationships and enum casts
├── Providers/              GatewayServiceProvider binds the Gateway driver
└── Services/Gateway/       Driver interface + Stub implementation + DTOs

resources/
├── css/app.css             Tailwind v4 theme tokens (emerald brand)
├── js/
│   ├── app.tsx             Inertia entry + layout router
│   ├── layouts/            Marketing, customer (AppLayout), admin, auth shells
│   ├── pages/
│   │   ├── marketing/      Home, pricing, features, faq, docs, terms, privacy
│   │   ├── app/            Customer dashboard pages
│   │   ├── admin/          Admin pages
│   │   ├── auth/           Fortify-backed auth pages
│   │   ├── settings/       Profile, security, appearance
│   │   └── errors/         Branded 404/403/500
│   └── components/
│       ├── ui/             shadcn-style primitives
│       ├── app/            Dashboard building blocks (StatCard, EmptyState, StatusBadge…)
│       └── marketing/      Logo, FeatureCard, CodeTabs, SectionHeading
└── views/pdf/              dompdf invoice template

database/
├── migrations/             18 SendGate tables + spatie/permission + spatie/activitylog
├── seeders/                Roles, settings, admin, demo customers
└── factories/              Factories for every model with PH-context defaults

routes/
├── web.php                 Marketing + customer + admin
├── api.php                 Public REST API v1 with key-bearer auth
├── settings.php            Profile / Security / Appearance
└── console.php             Scheduled jobs (invoices monthly, scheduled msgs/min, reminders daily)
```

---

## Wiring the real gateway (YX GP)

The MVP runs on `StubGateway` — outbound messages get a row in `sms_messages` and a delayed job (`SimulateMessageDeliveryJob`) flips them to `delivered` after 2-5s so dashboards look alive.

To swap in real hardware:

1. Set `GATEWAY_DRIVER=yxgp` in `.env` and provide `YXGP_HOST`, `YXGP_USERNAME`, `YXGP_PASSWORD`.
2. Implement the three methods on `app/Services/Gateway/YxGpGateway.php` (`sendSms`, `getSimStatus`, `pollIncomingMessages`) against the YX GP HTTP API.
3. Wire `pollIncomingMessages` into a recurring job to ingest inbound SMS.

The rest of the application — controllers, jobs, dashboards, API — continues to work unchanged because everything depends on `App\Services\Gateway\GatewayInterface`.

---

## Useful commands

```bash
# Run the test suite
php artisan test --compact

# Format PHP
vendor/bin/pint --dirty --format agent

# Regenerate Wayfinder route helpers (runs as part of vite build)
npm run build

# Inspect routes
php artisan route:list --except-vendor

# Inspect scheduled jobs
php artisan schedule:list

# Generate a fresh API key from the CLI
php artisan tinker --execute '$u=App\Models\User::where("email","demo@example.com")->first(); echo App\Models\ApiKey::generate($u, "Test")->plaintext;'

# Try the REST API
curl -H "Authorization: Bearer sg_live_…" http://sendgate.test/api/v1/account
```

---

## Deployment notes

- Designed to run on **Laravel Cloud**, but vanilla Laravel deployment works (any PHP 8.4 host with a database, queue worker, and scheduler).
- Set `APP_ENV=production`, `APP_DEBUG=false`.
- Run `php artisan migrate --force` and `npm run build` on deploy.
- Configure a queue worker (`php artisan queue:work --queue=default`) and the scheduler (`* * * * * php artisan schedule:run`).
- Set `GATEWAY_DRIVER=yxgp` once the hardware integration is finished (see "Wiring the real gateway" above).
- Storage symlink: `php artisan storage:link` for payment proof uploads.

---

## Out of scope (planned, not yet implemented)

- **Email notifications**: notification classes are not yet wired (skipped for MVP). Hooks exist in jobs and controllers (`TODO Phase 8`) for future addition.
- **Outbound webhook delivery**: webhook UI and storage are complete, but the worker that actually POSTs to subscriber URLs is not yet implemented.
- **CSV contact import wizard**: the endpoint exists; the multi-step UI for column mapping is stubbed.
- **PayMongo / Stripe**: manual bank-transfer-with-proof workflow only.
- **Real YX GP gateway driver**: stub-only; see "Wiring the real gateway".
- **Multi-tenancy / teams**: single-user accounts only.

---

## License

Proprietary — © SendGate Philippines, Inc.
