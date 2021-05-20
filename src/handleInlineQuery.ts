import { pix } from 'pix-me'
import { InlineQuery } from 'typegram'
import { format } from 'util'
import { Response } from './domain/Response'
import { User } from './domain/User'

export function handleInlineQuery(
  user: User,
  query: InlineQuery
): Response<'answerInlineQuery'> {
  const match = query.query.match(/[\d.,]/)

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
      switch_pm_text: 'Não tenho seus dados. Utilize /setinfo',
      switch_pm_parameter: query.query
    }
  }

  const value = query.query.replace(/,/g, '.')

  const pixCode = pix({
    key: user.pixKey as any,
    amount: value as any,
    city: user.city,
    name: user.name
  })

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
            'Para me transferir %s reais, utilize o código abaixo:\n\n`%s`',
            value,
            pixCode
          ),
          parse_mode: 'Markdown'
        }
      }
    ]
  }

  return response
}
