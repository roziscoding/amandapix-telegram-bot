import * as math from 'mathjs'
import { format } from 'util'
import { pix } from 'pix-me'
import { InlineQuery } from 'typegram'
import { Response } from './domain/Response'
import { User } from './domain/User'
import { config } from './config'

async function evaluateQuery(query: string): Promise<number> {
  return math.round(math.evaluate(query), 2)
}

export async function handleInlineQuery(
  user: User,
  query: InlineQuery
): Promise<Response<'answerInlineQuery'>> {
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

  const value = await evaluateQuery(query.query.replace(/,/g, '.')).catch((err) => {
    console.error(err)
    return null
  })

  if (!value) {
    return {
      method: 'answerInlineQuery',
      inline_query_id: query.id,
      results: []
    }
  }

  const pixCode = pix({
    key: user.pixKey,
    amount: value.toFixed(2),
    city: user.city,
    name: user.name
  })

  const qrCodeUrl = encodeURI(
    format(
      'https://%s/api/qrcode?telegramId=%s&value=%s',
      config.webhook.url,
      user.telegramId,
      value
    )
  )

  const response: Response<'answerInlineQuery'> = {
    method: 'answerInlineQuery',
    inline_query_id: query.id,
    cache_time: 0,
    is_personal: true,
    results: [
      {
        id: `${value}`,
        type: 'article',
        title: format('Gerar código pix de %s reais', value),
        input_message_content: {
          message_text: format(
            'Para me transferir %s reais, escaneie o [QRCode](%s) ou utilize o código abaixo (clique no código para copiar):\n\n`%s`',
            value,
            qrCodeUrl,
            pixCode
          ),
          parse_mode: 'Markdown'
        }
      }
    ]
  }

  return response
}
