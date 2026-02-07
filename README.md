# GigaClaw Dash

Self-service portal for team members to create their own AI assistants on a shared OpenClaw instance (GigaClaw Agents).

![Gigaverse Theme](https://img.shields.io/badge/theme-Gigaverse-02C7D7)

## Features

- 🔐 Slack OAuth integration
- 🤖 Automatic agent provisioning via OpenClaw config.patch
- 🎨 Gigaverse color palette
- ⚡ Next.js 15 + Tailwind CSS

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Onboarding  │────▶│   OpenClaw   │────▶│    Slack     │
│   Web App    │     │   Gateway    │     │   (OAuth)    │
│  (Next.js)   │◀────│              │◀────│              │
└──────────────┘     └──────────────┘     └──────────────┘
        │                    │
        │   config.patch     │
        └────────────────────┘
```

## Setup

### 1. Create Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create New App → From scratch
3. Add OAuth scopes:
   - `app_mentions:read`
   - `channels:history`, `channels:read`
   - `chat:write`
   - `groups:history`, `groups:read`
   - `im:history`, `im:read`, `im:write`
   - `mpim:history`, `mpim:read`
   - `users:read`
4. Enable OAuth & Permissions
5. Add redirect URL: `https://your-domain.com` (or `http://localhost:3000` for dev)
6. Copy Client ID and Client Secret

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
SLACK_CLIENT_ID=your_client_id
SLACK_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_SLACK_CLIENT_ID=your_client_id
NEXT_PUBLIC_SLACK_REDIRECT_URI=http://localhost:3000

OPENCLAW_GATEWAY_URL=http://localhost:18789
OPENCLAW_GATEWAY_TOKEN=your_gateway_token
```

### 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

Set environment variables in Vercel dashboard.

### Self-Hosted

```bash
npm run build
npm start
```

## How It Works

1. **Connect Slack**: User clicks "Add to Slack" → OAuth flow
2. **Configure**: User names their agent and enters their Slack User ID
3. **Provision**: App calls OpenClaw's `config.patch` to:
   - Add new agent to `agents.list[]`
   - Add Slack account with DM allowlist
   - Add binding to route DMs to the agent
4. **Gateway restarts** with new config
5. **Ready**: User can now DM their bot

## API Routes

### `POST /api/slack/callback`

Exchanges Slack OAuth code for tokens.

### `POST /api/onboard`

Provisions a new agent in OpenClaw.

```json
{
  "agentName": "my-assistant",
  "slackUserId": "U0123456789",
  "botToken": "xoxb-...",
  "appToken": "xapp-..." // optional
}
```

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#0E1925` | Background |
| Teal | `#0C384C` | Cards |
| Blue | `#0483AB` | Accents |
| Cyan | `#02C7D7` | Primary |
| Gold | `#F8D14E` | Highlights |

## License

MIT
