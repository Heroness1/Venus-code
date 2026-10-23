# VENUS CODE

Premium mystical astrology-inspired relationship reflection app built with Next.js App Router.

## Features
- Name and full date-of-birth profile
- Sun sign and Life Path number for entertainment/reflection
- Relationship reflection essay prompts
- Server-side Telegram delivery endpoint
- Telegram bot token kept in server environment variables
- Clear privacy notice before submission

Astrology and numerology are for entertainment and self-reflection only; they do not prove someone's character or intentions.

## Setup
1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env.local`.
4. Run `npm run dev`.

Never commit real bot tokens or private chat IDs. Configure the same environment variables in Vercel Project Settings before deployment.
