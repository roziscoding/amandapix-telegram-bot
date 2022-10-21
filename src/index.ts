import { getBot } from './bot'
import { config } from './config'

async function start() {
  const bot = await getBot(config)

  bot.start({
    onStart: ({ username }) => {
      console.log(`Bot listening via polling as @${username}`)
    }
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
