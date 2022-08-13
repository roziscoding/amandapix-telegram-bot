import * as math from 'mathjs'
import { InlineQuery } from 'typegram'
import { format } from 'util'
import { config } from '../config'
import { getPixCodeForUser } from '../util/pixCode'
import { Response } from './domain/Response'
import { User } from './domain/User'

export async function evaluateQuery(query: string): Promise<number> {
  return math.round(math.evaluate(query), 2)
}

export async function handleInlineQuery(user: User, query: InlineQuery): Promise<Response<'answerInlineQuery'>> {
  const match = query.query.match(/[\d.,]+/gi)

  if (!match) {
    return {
      method: 'answerInlineQuery',
      inline_query_id: query.id,
      results: []
    }
  }

  if (!user.pixKey) {
    return {
      method: 'answerInlineQuery',
      inline_query_id: query.id,
      cache_time: 0,
      results: [],
      switch_pm_text: 'Clique aqui pra se cadastrar',
      switch_pm_parameter: query.query
    }
  }

  const amount = await evaluateQuery(query.query.replace(/,/g, '.')).catch((err) => {
    console.error(err)
    return null
  })

  if (!amount) {
    return {
      method: 'answerInlineQuery',
      inline_query_id: query.id,
      results: []
    }
  }

  const pixCode = getPixCodeForUser(user, amount)

  const qrCodeUrl = encodeURI(
    format('https://%s/api/qrcode?telegramId=%s&value=%s', config.webhook.url, user.telegramId, amount)
  )

  const response: Response<'answerInlineQuery'> = {
    method: 'answerInlineQuery',
    inline_query_id: query.id,
    cache_time: 0,
    is_personal: true,
    results: [
      {
        id: `${amount}`,
        type: 'article',
        title: format('Gerar código pix de %s reais', amount),
        input_message_content: {
          message_text: format(
            'Para me transferir %s reais, escaneie o [QRCode](%s) ou utilize o código abaixo (clique no código para copiar):\n\n`%s`',
            amount,
            qrCodeUrl,
            pixCode
          ),
          parse_mode: 'Markdown'
        }
      },
      {
        id: `req-${amount}`,
        type: 'article',
        title: format('Solicitar código pix de %s reais', amount),
        input_message_content: {
          message_text: format(
            '%s deseja te enviar R$ %s via pix! Para gerar um código pix neste valor, clique no botão abaixo.',
            user.name,
            amount
          )
        },
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: format('Gerar código Pix de R$ %s', amount),
                switch_inline_query_current_chat: query.query
              }
            ]
          ]
        }
      }
    ]
  }

  return response
}
