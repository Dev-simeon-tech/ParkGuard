# ParkGuard Mobile

Expo (React Native) app for attendants: scan plates on entry/exit and compute
parking fees via the existing `apps/api` backend.

## Prerequisites

- `apps/api` running locally (see `apps/api/README.md` or just `pnpm dev`
  from that folder).
- **Expo Go** installed on your phone (App Store / Play Store).
- Phone and computer on the **same Wi-Fi network**.

## Environment setup

Copy the example env file if you haven't already:

```bash
cp .env.example .env
```

By default `EXPO_PUBLIC_API_URL` points at `localhost`, which only works
when running in the **iOS Simulator** (it shares your Mac's localhost). A
**physical phone** can't reach `localhost` — that resolves to the phone
itself — so you need to point it at your computer's LAN IP instead:

```bash
# macOS
ipconfig getifaddr en0
```

Then set it in `.env`:

```
EXPO_PUBLIC_API_URL=http://<your-lan-ip>:9001/api/v1
```

Your LAN IP can change (different network, DHCP renewal) — if the app
suddenly can't reach the API, this is the first thing to check.

## Running on a physical device

1. Start the API: `cd ../api && pnpm dev`
2. Start Expo **with a cache clear** whenever you've just changed `.env`:

   ```bash
   npx expo start --clear
   ```

   Expo inlines `EXPO_PUBLIC_*` env vars into the bundle at build time and
   caches that bundle — a plain `pnpm dev` / `npx expo start` after an env
   change can silently keep serving the old value. `--clear` forces a fresh
   bundle. You only need this after touching `.env`; day-to-day restarts
   don't require it.
3. Scan the QR code Expo prints in the terminal:
   - **iOS**: open the Camera app and scan it — it'll prompt to open in
     Expo Go.
   - **Android**: open Expo Go and use its built-in scanner.

   Since the phone and computer share Wi-Fi, Expo connects directly over
   LAN — no tunnel needed.

4. **First connection only**: macOS may prompt "Do you want the application
   'node' to accept incoming network connections?" when your phone's first
   request hits the API — click **Allow**, otherwise requests will silently
   time out.

## Running on the iOS Simulator

No LAN IP needed — `localhost` works as-is since the simulator shares the
Mac's network stack:

```bash
pnpm ios
```
