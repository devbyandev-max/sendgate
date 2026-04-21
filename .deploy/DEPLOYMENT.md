# SendGate — Production Deployment Guide

Target stack: **DigitalOcean droplet (2 vCPU / 4 GB AMD) + Ubuntu 22.04 + Laravel Forge + MySQL 8 + Redis + Nginx + PHP 8.4 FPM**.

This is a checklist, not a generic Laravel-deploy guide. Follow it top to bottom on a fresh droplet.

---

## 1. Push the repo to GitHub

If you haven't already:

```bash
git push origin main
```

Forge needs a Git remote it can read. Ensure your GitHub account is the owner (or that the repo is in an org Forge can access).

## 2. Create a Forge account

- Go to https://forge.laravel.com → sign up.
- Connect a **DigitalOcean** API token under **Server Providers** (DO console → API → Tokens → Generate, paste into Forge).
- Connect **GitHub** under **Source Control**.

## 3. Provision the droplet from Forge

In Forge, **Servers → New Server**:

- **Provider:** DigitalOcean
- **Region:** Singapore (`sgp1`) — closest to your PH customers and any colocated hardware
- **Size:** Premium AMD `s-2vcpu-4gb-amd` ($28/mo)
- **Server name:** `sendgate-prod`
- **PHP version:** `8.4`
- **Database:** `MySQL 8`
- **Database name:** `sendgate`
- Click **Create Server**

This takes ~7 minutes. Forge installs PHP 8.4, Nginx, MySQL 8, Redis, supervisor, certbot, and a deploy user. **Save the displayed `sudo`, `database`, and `forge` user passwords** in your password manager — you only see them once.

## 4. Point your domain at the droplet

You should already have a domain. In your DNS provider:

```
A     sendgate.ph        →  <droplet IPv4>
A     www.sendgate.ph    →  <droplet IPv4>
```

Wait for DNS to propagate (usually a few minutes — check with `dig sendgate.ph +short`).

## 5. Create the site in Forge

**Sites → New Site:**

- **Root domain:** `sendgate.ph`
- **Aliases:** `www.sendgate.ph`
- **Project type:** Inertia
- **Web directory:** `/public`
- **PHP version:** `8.4`
- Click **Add Site**

Then on the site detail page:

- **Apps tab → Install Repository**
  - Provider: GitHub
  - Repository: `<your-username>/sendgate`
  - Branch: `main`
  - Composer: ✅ Install Composer dependencies
  - Click **Install Repository**

## 6. Configure environment variables

**Site → Environment** in Forge. Replace the contents of `.env` with:

```dotenv
APP_NAME="SendGate"
APP_ENV=production
APP_KEY=                          # Forge generates this in step 7 if blank
APP_DEBUG=false
APP_URL=https://sendgate.ph
APP_TIMEZONE=Asia/Manila

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=warning

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sendgate
DB_USERNAME=forge
DB_PASSWORD=                      # paste from Forge welcome email

BROADCAST_CONNECTION=log
CACHE_STORE=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com         # or your SMTP provider
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=                    # Resend API key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="billing@sendgate.ph"
MAIL_FROM_NAME="${APP_NAME}"

# SendGate gateway
GATEWAY_DRIVER=stub               # change to "yxgp" once hardware is connected
YXGP_HOST=
YXGP_USERNAME=
YXGP_PASSWORD=
YXGP_CHARSET=utf8
YXGP_TIMEOUT=10
YXGP_VERIFY_TLS=true
GATEWAY_CALLBACK_TOKEN=           # generate: openssl rand -hex 32

VITE_APP_NAME="${APP_NAME}"
```

Click **Save**.

## 7. Configure the deploy script

**Site → Deployment → Edit Deploy Script:**

```bash
cd $FORGE_SITE_PATH

git pull origin $FORGE_SITE_BRANCH

$FORGE_COMPOSER install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Frontend
[ -f package-lock.json ] && npm ci || npm install
npm run build

# Laravel
( flock -w 10 9 || exit 1
    echo 'Restarting FPM...'; sudo -S service $FORGE_PHP_FPM reload ) 9>/tmp/fpmlock

$FORGE_PHP artisan migrate --force
$FORGE_PHP artisan storage:link 2>/dev/null || true
$FORGE_PHP artisan config:cache
$FORGE_PHP artisan route:cache
$FORGE_PHP artisan view:cache
$FORGE_PHP artisan event:cache
$FORGE_PHP artisan queue:restart
```

## 8. Generate APP_KEY and seed the database

SSH in (Forge has a one-click button: **Server → Connect → Open Terminal**), then:

```bash
cd /home/forge/sendgate.ph
php artisan key:generate --force
php artisan migrate --force --seed       # seed once for the admin user, then comment out
```

The seed creates `admin@sendgate.ph` / `password`. **Log in immediately and change the password.**

## 9. First deploy

- **Site → Deploy Now** button
- Watch the logs scroll. First deploy ~3-5 min.
- Browse to `https://sendgate.ph` — you should see the marketing site.

## 10. Enable HTTPS

**Site → SSL → LetsEncrypt** — pick `sendgate.ph` and `www.sendgate.ph`, click **Obtain Certificate**. Forge auto-renews every 60 days.

## 11. Queue worker (critical)

SendGate dispatches jobs (`SendSmsJob`, `RunCampaignJob`, `GenerateInvoicesJob`, `SimulateMessageDeliveryJob`).

**Site → Queue → New Worker:**

- **Connection:** redis
- **Queue:** default
- **Processes:** 2
- **Stop wait seconds:** 10
- **Timeout:** 60
- **Sleep:** 3
- **Tries:** 3
- ✅ Force
- Click **Start Worker**

Forge installs a supervisor config that auto-restarts the worker if it crashes.

## 12. Scheduler (critical)

Without this, scheduled SMS won't send and invoices won't generate.

**Server → Scheduler → New Job:**

- **Command:** `php artisan schedule:run`
- **User:** forge
- **Frequency:** Every minute
- Click **Save**

## 13. Storage permissions

Already handled by Forge, but verify by uploading a payment proof from `/app/billing/invoices/{id}` once you're logged in — should land in `storage/app/public/payment-proofs/`.

## 14. Daily backups

**Server → Database → Backup Configuration:**

- **Frequency:** Daily at 03:00 (Asia/Manila)
- **Provider:** DigitalOcean Spaces ($5/mo for 250 GB) or AWS S3
- **Retention:** 14 days

If you skip this you have *no* recovery from data loss. Don't skip it.

## 15. Hardware gateway hookup (when ready)

Two parts:

### Connect the droplet to your hardware

The droplet needs to talk to the YX GP over the device's HTTP API. Three options, ranked:

1. **Tailscale** (recommended, easiest):
   ```bash
   # On the droplet
   curl -fsSL https://tailscale.com/install.sh | sh
   sudo tailscale up
   # On the box where the YX GP lives, also install Tailscale and join the same tailnet
   # Then set YXGP_HOST=100.x.y.z (the device's tailnet IP)
   ```
   Free tier covers up to 100 devices. The droplet talks to the gateway over a private encrypted mesh — no port-forwarding, no public exposure.

2. **DigitalOcean VPC + private network** — works if the gateway is also on DO. Less common because GSM hardware isn't usually colocated in a cloud DC.

3. **OpenVPN/WireGuard manual setup** — if you already have a VPN.

### Configure the device callbacks

Once Tailscale is up:

1. SSH in, set `.env`:
   ```
   GATEWAY_DRIVER=yxgp
   YXGP_HOST=100.64.0.5:8080         # device's tailnet IP and admin port
   YXGP_USERNAME=root
   YXGP_PASSWORD=<from device admin>
   GATEWAY_CALLBACK_TOKEN=$(openssl rand -hex 32)
   ```
2. `php artisan config:clear`
3. Browse to `https://sendgate.ph/admin/gateway` — the page shows the exact callback URLs to paste into the YX GP web admin (under **SMS Setting → SMS to HTTP** and **Status Notification**).
4. In **Admin → SIMs**, set each SIM's `port_number` to its physical slot (1–64).
5. Click **Run health check** on the gateway page → green = ready.
6. Send a test SMS from `/app/sms/send` to your own phone.

## 16. Smoke test the production site

- [ ] `https://sendgate.ph` → marketing renders, dark mode applied
- [ ] `https://sendgate.ph/login` → can log in as admin
- [ ] `https://sendgate.ph/admin/dashboard` → loads
- [ ] `https://sendgate.ph/app/dashboard` → loads (use `demo@example.com` if you kept the seed)
- [ ] `https://sendgate.ph/app/sms/send` → submit a test message, see it in `/app/sms/outbox` (status simulates "delivered" after a few seconds via the stub gateway and queue worker)
- [ ] Generate an API key, then from your laptop:
  ```bash
  curl -H "Authorization: Bearer sg_live_..." https://sendgate.ph/api/v1/account
  ```
  Should return JSON with your account info.

## 17. Monitoring (do this in week 1)

- **Forge → Server → Monitor:** enable basic CPU/memory/disk alerts to your email.
- **Sentry** (free tier): `composer require sentry/sentry-laravel`, paste DSN into `.env`. Catches unhandled exceptions in production.
- **Uptime Robot** (free): monitor `https://sendgate.ph/up` (Laravel's built-in health endpoint), alert on 5-min downtime.

---

## Cost summary

| Item | Cost / mo |
|---|---|
| DO droplet (2vCPU / 4GB AMD) | $28 |
| DO Spaces backups (250 GB) | $5 |
| Laravel Forge | $19 |
| Domain (`sendgate.ph` annual) | ~$0.50/mo amortized |
| Email (Resend free tier — 3000/mo) | $0 |
| Tailscale (free tier) | $0 |
| **Total** | **~$53/mo** |

---

## Post-deploy maintenance routine

- **Weekly:** check Forge dashboard for failed deploys, queue worker health, disk usage.
- **Monthly:** `apt update && apt upgrade` from Forge UI (Server → Update System).
- **Quarterly:** rotate `GATEWAY_CALLBACK_TOKEN` and `APP_KEY` (the latter only if you're confident it leaked — rotating breaks active sessions).

## Things you should NOT do

- ❌ Run `php artisan migrate:fresh` in production. It drops every table.
- ❌ Use `--seed` after the first deploy. Seeders may overwrite real data.
- ❌ Set `APP_DEBUG=true` to "see what went wrong" — that exposes stack traces and the `.env` to attackers. Use `php artisan pail` over SSH instead.
- ❌ Commit your real `.env` file (it's gitignored already, just don't override that).
- ❌ Open MySQL or Redis to public IPs (Forge fires firewall rules to prevent this by default — leave them).

---

## Troubleshooting cheatsheet

| Symptom | First thing to check |
|---|---|
| 500 errors on every page | `tail -100 /home/forge/sendgate.ph/storage/logs/laravel.log` |
| Vite asset 404s after deploy | Did `npm run build` actually run? Check the deploy log. |
| Queue not processing jobs | `php artisan queue:failed` — also check supervisor: `sudo supervisorctl status` |
| Scheduled jobs not firing | `sudo crontab -l -u forge` — should show the every-minute entry |
| Nginx not reloading after deploy | `sudo nginx -t` to see the config error |
| Redis can't connect | `redis-cli ping` should return `PONG`. If not: `sudo systemctl status redis` |
| HTTPS not renewing | Forge → Site → SSL → Renew Certificate |

For anything else, `php artisan pail` over SSH gives you live tail of every log message.
