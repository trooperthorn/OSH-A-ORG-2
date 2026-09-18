# A-ORG-2

One globe. Every base. The brief that ships itself.

Ground-up rebuild of A-ORG-1 around three jobs: global search of every Army
installation · parent-child connection lines only · brief mode with a real
datastore (people, notes, equipment, diagrams) and a native PDF export.

- **The app**: `index.html` — the whole thing, single file, no build, PWA.
- **The map layer**: `data/sites.json` — base + owning unit + one parent pointer.
- **Charter**: `docs/CHARTER.md` — scope contract, roadmap, team.

Status: M1 (Foundation & Globe) in progress → v0.1.0.

## Hosting (v2.9.0)

The app is almost entirely static files (`index.html`, `sw.js`,
`manifest.webmanifest`, icons, `data/*.json`). The one non-static piece is
**Live Assets** (v2.8.0): `index.html` polls same-origin `GET /api/live.json`
every ~18s, and the separate `swis-live-poller` repo (running on the LAN)
pushes position snapshots to `POST /api/live-ingest` with a bearer token.
That contract can be served two ways:

- **Cloudflare** (`worker.js` + `wrangler.jsonc`) — still fully supported,
  still deploys as before. No longer required.
- **`local-server/`** — a zero-dependency Node server that serves the static
  files AND implements the exact same two routes against a local JSON file
  instead of Cloudflare KV. This is the primary path as of v2.9.0. `index.html`
  needs no changes to work against either backend.

### Run it with Docker (preferred)

```bash
# from the repo root
LIVE_PUSH_TOKEN=pick-a-long-random-value docker compose up -d --build
```

This builds `local-server/Dockerfile` and starts the app on
`http://localhost:8080`. `LIVE_PUSH_TOKEN` is the bearer token
`swis-live-poller` must send; leaving it unset is safe — the app still
serves and boots, `/api/live-ingest` just refuses every push (500) until a
token is set. The last-pushed live-assets snapshot persists in the
`a-org-2-live-data` Docker volume across restarts.

Without Compose:

```bash
docker build -f local-server/Dockerfile -t a-org-2-local .
docker run -d --name a-org-2 -p 8080:8080 \
  -e LIVE_PUSH_TOKEN=pick-a-long-random-value \
  -v a-org-2-live-data:/data \
  a-org-2-local
```

### Run it as a Windows process behind IIS

IIS is a static-file/reverse-proxy server; it cannot run `server.js`
directly. The reliable pattern — and the one used here — is: run
`local-server/server.js` as a background Windows process on a local port,
let IIS serve the static files directly from the repo folder as a normal
website, and use IIS's **Application Request Routing (ARR) + URL Rewrite**
to reverse-proxy just `/api/*` to that local process. (The alternative —
hosting the Node process itself inside IIS via `httpPlatformHandler` — needs
more IIS-side configuration to get exactly right and is not documented here;
ARR + URL Rewrite is simpler and more reliable to set up correctly.)

**1. Install prerequisites** (once, on the IIS host): [Node.js](https://nodejs.org/)
(no other dependencies — `local-server/server.js` uses only Node's stdlib),
then in IIS Manager or via the Web Platform Installer, install **Application
Request Routing (ARR)** and **URL Rewrite**.

**2. Run the local server as a background process.** Simplest: Task
Scheduler, "run at startup", no interactive session:

```powershell
$action  = New-ScheduledTaskAction -Execute "node.exe" `
  -Argument "local-server\server.js" `
  -WorkingDirectory "C:\path\to\OSH-A-ORG-2"
$trigger = New-ScheduledTaskTrigger -AtStartup
$princ   = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName "A-ORG-2 local server" -Action $action -Trigger $trigger -Principal $princ

# set env vars for that task (PORT defaults to 8080; pick your own token)
[Environment]::SetEnvironmentVariable("LIVE_PUSH_TOKEN", "pick-a-long-random-value", "Machine")

Start-ScheduledTask -TaskName "A-ORG-2 local server"
```

(A proper Windows Service via `node-windows` or NSSM is a reasonable
alternative if you want start/stop/recovery semantics; the Scheduled Task
above is the minimum that survives a reboot.)

**3. Create the IIS website serving the static files:**

```powershell
Import-Module WebAdministration
New-Website -Name "A-ORG-2" -PhysicalPath "C:\path\to\OSH-A-ORG-2" `
  -Port 80 -HostHeader "a-org-2.example.local"
```

**4. Add `web.config`** in the repo root (same folder as `index.html`) with
an ARR/URL Rewrite rule that proxies `/api/*` to the local Node process and
serves everything else as static files:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Live API proxy" stopProcessing="true">
          <match url="^api/(.*)$" />
          <action type="Rewrite" url="http://localhost:8080/api/{R:1}" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

**5. Enable ARR as a proxy** (once, server-wide, in IIS Manager): Server
node → Application Request Routing Cache → Server Proxy Settings… → check
"Enable proxy" → Apply.

With that in place, `https://a-org-2.example.local/` serves `index.html`
directly from IIS, and `/api/live.json` / `/api/live-ingest` transparently
reach the local Node process on port 8080. Point `swis-live-poller` at
`https://a-org-2.example.local/api/live-ingest` with the same
`LIVE_PUSH_TOKEN`.

### Environment variables

| Variable | Used by | Default | Purpose |
|---|---|---|---|
| `PORT` | `local-server/server.js` | `8080` | port the Node server listens on |
| `LIVE_PUSH_TOKEN` | `local-server/server.js`, `worker.js` (as a Cloudflare secret) | unset | bearer token `swis-live-poller` must send; unset = ingest always refused (500), read/static still work |
| `LIVE_DATA_DIR` | `local-server/server.js` | `local-server/.data` (Docker: `/data`) | where the last-pushed live-assets snapshot is stored |

### What did NOT change

`index.html`'s `_liveFetch()`/`liveAssetsToggle()` and the whole Live Assets
feature are byte-for-byte unchanged — both backends answer the identical
contract, so switching between Cloudflare and the local server (or running
both) needs no app changes, only pointing `swis-live-poller` at whichever
origin is live.
