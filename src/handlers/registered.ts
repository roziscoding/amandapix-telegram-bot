import { stripIndents } from 'common-tags'
import { Bot, InlineKeyboard } from 'grammy'
import { AppContext } from '../bot'
import { getPixCodeForUser } from '../util/pix-code'
import { evaluateQuery } from '../util/query'

export function install(bot: Bot<AppContext>) {
  bot
    .filter((ctx) => !!ctx.session.pixKey)
    .inlineQuery(/[\d.,]+/gi, async (ctx) => {
      if (!ctx.match || !Array.isArray(ctx.match) || !ctx.match[0]) {
        return ctx.answerInlineQuery([], {
          cache_time: 0
        })
      }

      const [query] = ctx.match

      const amount = await evaluateQuery(query)

      if (!amount) return ctx.answerInlineQuery([])

      const pixCode = getPixCodeForUser(ctx.session, amount)
      const qrCodeUrl = ctx.getQrCodeUrl(pixCode)

      return ctx.answerInlineQuery([
        {
          id: query,
          type: 'article',
          title: `Gerar código pix de R$ ${amount}`,
          input_message_content: {
            message_text: stripIndents`
              Para me transferir R$ ${amount}, escaneie o <a href="${qrCodeUrl}">QRCode</a> ou utilize o código abaixo (clique no código para copiar):

              <code>${pixCode}</code>
            `,
            parse_mode: 'HTML'
          }
        },
        {
          id: `req-${query}`,
          type: 'article',
          title: `Solicitar código pix de R$ ${amount}`,
          input_message_content: {
            message_text: `${ctx.session.name} deseja te enviar R$ ${amount} via pix! Para gerar um código pix neste valor, clique no botão abaixo.`
          },
          reply_markup: new InlineKeyboard().switchInlineCurrent(`Gerar código pix de R$ ${amount}`, amount.toFixed(2))
        }
      ])
    })
}
