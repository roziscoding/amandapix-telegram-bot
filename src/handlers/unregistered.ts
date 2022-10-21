import { Bot } from 'grammy'
import { AppContext } from '../bot'

export function install(bot: Bot<AppContext>) {
  bot
    .filter((ctx) => !ctx.session.pixKey)
    .inlineQuery(/[\d.,]+/gi, (ctx) =>
      ctx.answerInlineQuery([], {
        switch_pm_text: 'Clique aqui pra se cadastrar',
        switch_pm_parameter: ctx.inlineQuery.query,
        cache_time: 0
      })
    )
}
