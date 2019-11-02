# cloudconvert-bot

This Telegram bot ([@cloud_convert_bot](https://t.me/cloud_convert_bot)) mediates between the Telegram servers and those of
cloudconvert.com to provide file conversions in Telegram. It also relies on a
MongoDB hosted at mlab. The code runs on GAE.

Please create two bots using [@BotFather](https://t.me/BotFather), one for production and one for development.
The bot runs with webhooks but it will automatically switch to long polling mode if 'dev' is contained in the bot name.
(E. g. the primary test bot is [@cloud_convert_dev_bot](https://t.me/cloud_convert_dev_bot).)
This way, you can host the bot efficiently (webhooks) and still use it locally (long polling).

However, it will always rely on `.env`. The file `.env.production` will be ignored.
You need to exchange them to switch between the bots.

## Install

```bash
npm up && npm i
```

## Compile

```bash
tsc
```

## Run in prod

```bash
npm start
```

## Run with all logs

```bash
npm run-script debug
```

## Deploy

```bash
gcloud app deploy
```

## What else is there to say

There's not too much documentation, but the code is quite clean IMO.
If you have questions regarding anything, contact [me](https://t.me/KnorpelSenf) or join the [discussion group](https://t.me/cloud_convert_bot_lounge).
There's also a [news channel](https://t.me/cloud_convert_bot_news).
