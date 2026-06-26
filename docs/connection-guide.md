# Connecting the Raspberry Pi to the YX GP Gateway

How to wire a Raspberry Pi (the SendGate "bridge") to a YX‑Series GP hardware SMS
gateway so the Pi can reach the gateway's web UI / HTTP API **while staying
connected to the internet**.

This covers the local Pi ↔ gateway link, plus exposing it to the SendGate app:
**private** admin access for your own devices and a **public** send-API path for
Laravel Cloud (both via Tailscale). Callback relay and monitoring are covered in
the broader bridge setup. See `BUSINESS_PLAN.md` §10a for the hardware platform
and operations runbook.

---

## Topology

```
        Internet
           │ Wi-Fi (wlan0)  ← default route, internet
   ┌───────┴────────┐
   │  Raspberry Pi  │
   │  (Ubuntu       │
   │   Desktop)     │
   └───────┬────────┘
           │ Ethernet (eth0)  ← dedicated link, static 192.168.1.250/24
           │
   ┌───────┴────────┐
   │  YX GP gateway │  WAN port, static 192.168.1.10
   └────────────────┘
```

- **Internet** comes in over **Wi‑Fi (`wlan0`)** — this keeps the default route.
- The **gateway** is cabled straight into the Pi's **Ethernet port (`eth0`)**.
- `eth0` gets a **static** address on the gateway's subnet with **no default
  route**, so it talks to the gateway without disturbing internet access.

> If instead the gateway and the Pi are both plugged into the same router, the
> approach is the same except `eth0` keeps DHCP and you *add* `192.168.1.250/24`
> as a second address (see [Alternative wiring](#alternative-wiring-shared-router)).

---

## Key facts about the YX GP

| Item | Value |
|---|---|
| **WAN port default IP** | `192.168.1.10` (static — there is **no DHCP server** on the device) |
| LAN port default IP | `10.10.10.1` (not active on this firmware version — WAN only) |
| Web UI | `http://192.168.1.10` (port 80) |
| Default login | vendor default (e.g. `admin`/`admin` or `root/root`) — **change immediately** |

Because the WAN port is **static**, an interface set to **DHCP will hang**
("getting IP configuration" → activation failed). The Pi side must be static.

---

## Prerequisites

- Raspberry Pi running **Ubuntu Desktop** (uses **NetworkManager**).
- Pi connected to the internet over **Wi‑Fi**.
- Gateway **powered on** and its **WAN port cabled into the Pi's Ethernet port**
  (link LED lit — confirm before configuring; a dark port = "no carrier").

---

## Setup (NetworkManager)

Run on the Pi, **one line at a time** (avoid pasting multi-line `\` commands —
the line-continuation often mangles on paste and triggers
`invalid or not allowed setting 'ipv4'`).

```bash
# Remove the auto-created DHCP profile that keeps grabbing eth0 (name from:
#   nmcli -f NAME,DEVICE connection show
# usually "Wired connection 1")
sudo nmcli connection delete "Wired connection 1"

# Clean up any half-made profile from a previous attempt
sudo nmcli connection delete yx-gateway 2>/dev/null

# 1. Create a wired profile bound to eth0
sudo nmcli connection add type ethernet ifname eth0 con-name yx-gateway

# 2. Set the static IP — no DHCP, no default route (Wi-Fi keeps the internet)
sudo nmcli connection modify yx-gateway ipv4.method manual ipv4.addresses 192.168.1.250/24 ipv4.never-default yes ipv6.method ignore

# 3. Activate
sudo nmcli connection up yx-gateway
```

This profile is **persistent** — NetworkManager re-applies it on every boot.

---

## Verify

```bash
ip -br addr show eth0      # expect: eth0  UP  192.168.1.250/24
ping -c2 192.168.1.10      # expect replies
ip route                   # default route should still be via wlan0, NOT eth0
curl -sI http://192.168.1.10 | head -1   # any HTTP status (200/401/302) = reachable
```

Then open **Firefox on the Pi** → `http://192.168.1.10` to load the web UI.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Destination Host Unreachable` | ARP failed — nothing answering on that L2 segment / wrong interface | Confirm the gateway is plugged into **`eth0`** and powered; put the static IP on the interface that actually shares the wire with the gateway |
| `eth0` state = **unavailable** | No carrier (cable unplugged or gateway off) | Plug in the WAN cable, power the gateway; check `cat /sys/class/net/eth0/carrier` = `1` |
| `eth0` stuck **"connecting / getting IP configuration"** | Interface is on **DHCP**, but the gateway has no DHCP server | Use the static `yx-gateway` profile above; delete the DHCP "Wired connection 1" |
| **"Activation of network failed"** notification | DHCP timeout on `eth0` (no lease) or no carrier | Same as above — static profile + confirm carrier |
| `invalid or not allowed setting 'ipv4'` | `\` line-continuation mangled on paste | Run the `add` and `modify` as **separate single-line** commands (as above) |
| Web UI won't load but ping works | Browser/proxy or firmware quirk | Try `curl -sI http://192.168.1.10`; ensure no system proxy is set on the Pi |
| Lost internet after config | A default route landed on `eth0` | Ensure `ipv4.never-default yes` is set on `yx-gateway`; `ip route` default must be via `wlan0` |

Handy diagnostics:

```bash
nmcli device status                          # per-NIC state + active connection
nmcli -f NAME,DEVICE,AUTOCONNECT connection show
journalctl -u NetworkManager -n 20 --no-pager
for d in /sys/class/net/e*/carrier; do echo "$d = $(cat $d 2>/dev/null)"; done
```

---

## Alternative wiring: shared router

If the gateway and the Pi are both plugged into the **same router** (and the Pi
gets internet over that wired link), keep DHCP and just add the gateway-subnet
IP as a *second* address:

```bash
sudo nmcli connection modify "Wired connection 1" +ipv4.addresses 192.168.1.250/24
sudo nmcli connection up "Wired connection 1"
```

The gateway's static `192.168.1.10` is reachable over the same L2 segment; the
default route still comes from DHCP.

---

## Remote access & exposing the gateway

Two separate needs, two separate paths. **Never put the gateway admin UI on the
public internet** — it serves plain HTTP, gets brute-forced constantly, and a
compromise means SMS/toll fraud on customer SIMs plus message-body exposure
(`BUSINESS_PLAN.md` §13 requires the admin plane to be VPN-only).

```
                     Laravel Cloud (app)
                           │  HTTPS — send API only
                           ▼
                Tailscale Funnel (public URL)
                           │
                 ┌─────────┴─────────┐
                 │   Raspberry Pi    │
                 │   nginx :8080     │  ← allows only /goip_* paths
                 └─────────┬─────────┘
                           │ http://192.168.1.10:80
                           ▼
                     YX GP gateway
                           ▲
                 ┌─────────┴──────────┐
  Your Mac/phone │ Tailscale subnet   │  ← PRIVATE admin UI
  (on tailnet) ──▶ route 192.168.1.0/24   (your devices only)
                 └────────────────────┘
```

- **Public (Funnel):** only `/goip_*` (send/poll API) is reachable — for Laravel Cloud.
- **Private (subnet route):** full admin UI, only for your own Tailscale devices.

### 1. Install Tailscale on the Pi

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up        # opens a login URL — sign in (free account)
tailscale status         # confirm connected
```

### 2. Private admin access (subnet route)

Lets your own devices reach `192.168.1.10` through the Pi — no public exposure.

```bash
# enable IP forwarding (required for subnet routing)
echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf

# advertise the gateway's subnet to your tailnet
sudo tailscale up --advertise-routes=192.168.1.0/24
```

Then **approve the route** in the Tailscale admin console → Machines → the Pi →
⋯ → Edit route settings → enable `192.168.1.0/24`. Install Tailscale on your
Mac/phone (same account) and browse `http://192.168.1.10` from anywhere. (Linux
clients need `sudo tailscale up --accept-routes`; macOS/iOS/Android use it
automatically.)

### 3. Public send API (nginx filter + Funnel)

**a. nginx filter** — exposes only `/goip_*`, returns 404 for everything else so
the admin UI can never leak through Funnel. Write the config as a **single line**
into `/etc/nginx/conf.d/` (not `sites-available`, which may not exist; a single
line also avoids heredoc paste problems):

```bash
sudo apt install -y nginx
echo 'server { listen 127.0.0.1:8080; location ~ ^/goip_ { proxy_pass http://192.168.1.10:80; proxy_set_header Host $host; } location / { return 404; } }' | sudo tee /etc/nginx/conf.d/yx-proxy.conf
sudo nginx -t
sudo systemctl restart nginx        # restart, not reload — ensures it's actually running
sudo ss -ltnp | grep 8080           # must show nginx on 127.0.0.1:8080
curl -sI http://127.0.0.1:8080/ | head -1   # expect HTTP/1.1 404 (proves nginx is up)
```

**b. Funnel** — publishes the nginx port to a public HTTPS URL:

```bash
sudo tailscale funnel --bg 8080
tailscale funnel status             # prints https://<pi>.tailXXXX.ts.net
```

If Funnel isn't enabled, the command prints a link to the admin console — enable
**HTTPS certificates** + **Funnel** for the node, then re-run.

### 4. Point the app at it

In Laravel Cloud env (read by `config/gateway.php`):

```
GATEWAY_DRIVER=yxgp
YXGP_HOST=https://<pi>.tailXXXX.ts.net
YXGP_USERNAME=«gateway api user»
YXGP_PASSWORD=«gateway api password»
YXGP_VERIFY_TLS=true
```

Test the public path from anywhere:

```bash
curl -sI "https://<pi>.tailXXXX.ts.net/goip_get_sms.html?username=«u»&password=«p»&sms_num=0" | head -1
```

A device response = the cloud can reach the send API; non-`/goip_` paths return
404, so the admin UI stays private.

> The Funnel URL is tied to the Pi's tailnet identity, **not its IP** — it stays
> the same across reboots and internet changes, so `YXGP_HOST` never needs
> updating when the Pi moves.

### Exposure troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Terminal stuck at a `>` prompt | Pasted heredoc kept its indentation, so the closing `EOF` wasn't recognised | Press **Ctrl+C**; use the single-line `echo … \| tee` form instead |
| `tee: …/sites-available/…: No such file` | nginx not installed, or that dir doesn't exist | Install nginx; write to `/etc/nginx/conf.d/yx-proxy.conf` instead |
| `curl -sI …:8080` prints nothing | `-s` hides "connection refused" — nginx isn't listening | `sudo ss -ltnp \| grep 8080`; if empty, `sudo nginx -t` then `sudo systemctl restart nginx` |
| `ss` shows nothing on 8080 | Config not loaded, or nginx not running | `sudo nginx -t` (fix any error), then **restart** (not reload) |

---

## Reboots and changing the internet connection

Everything here is **persistent** — power-cycling the Pi or switching its
internet brings the gateway link back automatically.

### After a reboot

The `yx-gateway` NetworkManager profile auto-connects on boot, so `eth0` returns
at `192.168.1.250/24` and `192.168.1.10` is reachable again with no manual steps.
Confirm:

```bash
ip -br addr show eth0      # expect 192.168.1.250/24
ping -c2 192.168.1.10
```

If it ever fails to auto-start:

```bash
nmcli -g connection.autoconnect connection show yx-gateway   # want: yes
sudo nmcli connection up yx-gateway
```

### Changing Wi-Fi / moving the Pi to another network

The Pi ↔ gateway link on `eth0` is a **dedicated connection, independent of which
Wi-Fi/internet the Pi uses** — switching networks does not affect it. Just join
the new Wi-Fi (Ubuntu Desktop Wi-Fi menu, or
`nmcli device wifi connect "SSID" password "PASS"`).

Remote access via Tailscale is also unaffected: the Pi keeps the same tailnet
identity and public Funnel URL across any internet connection, so the app's
`YXGP_HOST` never changes when the Pi moves. (See **Remote access & exposing the
gateway** above.)

### ⚠️ Subnet-collision gotcha

The gateway lives on `192.168.1.0/24`, and **many home routers also default to
`192.168.1.1`**. If the Pi joins a Wi-Fi network that is also `192.168.1.x`, then
`wlan0` and `eth0` end up on the **same subnet** and the gateway can become
unreachable. Detect it after switching networks:

```bash
ip -br addr        # if wlan0 has a 192.168.1.x address → collision with eth0
```

**Fix (only if the collision actually happens):** move the gateway off the common
`192.168.1.x` subnet to one nothing else uses, e.g. `192.168.222.0/24`:

1. Gateway admin UI → Network/WAN → set static IP `192.168.222.10/24`.
2. On the Pi:
   ```bash
   sudo nmcli connection modify yx-gateway ipv4.addresses 192.168.222.250/24
   sudo nmcli connection up yx-gateway
   ```
3. If using a Tailscale subnet route, re-advertise and re-approve it:
   ```bash
   sudo tailscale up --advertise-routes=192.168.222.0/24
   ```

> Not done by default — the gateway stays on `192.168.1.10`. Only change the
> subnet if you actually hit a collision on a new network.

---

## Next steps

Once `http://192.168.1.10` loads:

1. **Change the default admin password** immediately (the factory default is a
   known risk — see `BUSINESS_PLAN.md` §13).
2. **Create an HTTP‑API user** — these become `YXGP_USERNAME` / `YXGP_PASSWORD`
   in the app's environment (`config/gateway.php`).
3. **Apply the config-discipline toggles** (disable SIM rotation, IMEI
   randomization, port inter-calling, fake ringback; enable SMS filter) per
   `BUSINESS_PLAN.md` §10a.
4. **Point inbound SMS forward** at the Pi callback relay.
5. Insert SIMs, record each slot as `port_number` in the admin panel, and run
   the send/receive smoke test.

See the bridge setup (tunnel + callback relay + monitoring) for the rest of the
path between this gateway and the Laravel Cloud app.
```