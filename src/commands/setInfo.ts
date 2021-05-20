import { format } from 'util'
import { Command } from '../domain/Command'

const setInfo: Command = {
  name: 'setinfo',
  helpText: 'Define suas informações do Pix. Uso: /setinfo chave, cidade, nome',
  regex: /\/setinfo(?: (?<key>.*), ?(?<city>.*), ?(?<name>.*))?/,
  fn: async (match, _, user, repository) => {
    const key = match?.groups?.key
    const city = match?.groups?.city
    const name = match?.groups?.name

    if (!key || !city || !name) {
      const missing = !key ? 'sua chave' : !city ? 'sua cidade' : 'seu nome'
      const text = format(
        'Opa, parece que você não enviou %s... Tente novamente com o formato `/setinfo [chave], [cidade], [nome]`. Troque `[chave]` pela sua chave Pix, `[cidade]` pela cidade onde você mora e `[nome]` pelo nome que você deseja utilizar nas transações',
        missing
      )

      return {
        method: 'sendMessage',
        text,
        chat_id: user.telegramId,
        parse_mode: 'Markdown'
      }
    }

    await repository.setInfo(user.telegramId, key, city, name)

    return {
      method: 'sendMessage',
      text: format(
        'Boa! Salvei seus dados:\n`Chave: %s`\n`Cidade: %s`\n`Nome%s`\n\nAgora, me chame no modo inline para enviar códigos Pix!',
        key,
        city,
        name
      ),
      chat_id: user.telegramId,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Clique para enviar um código Pix',
              switch_inline_query: ''
            }
          ]
        ]
      }
    }
  }
}

export default setInfo
