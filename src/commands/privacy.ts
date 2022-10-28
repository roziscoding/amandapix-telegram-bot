import { format } from 'util'
import { Command } from '../domain/Command'
import { PRIVACY_POLICY_URL, PRIVACY_TEXT } from '../util/strings'

export const privacy: Command = {
  name: 'privacy',
  helpText: 'Envia o link da política de privacidade do bot',
  fn: async (ctx) => {
    const message = format(PRIVACY_TEXT, PRIVACY_POLICY_URL)

    return ctx.reply(message, { parse_mode: 'HTML' })
  }
}
