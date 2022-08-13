import { CONFIRM, REMOVE_KEYBOARD } from '../../util/telegram/sendMessage'
import { getWizard } from '../../util/telegram/wizard'
import { Command } from '../domain/Command'

const stop: Command = {
  name: 'stop',
  regex: /\/stop/,
  helpText: 'Apaga todos os dados que eu tenho armazenados sobre você',
  fn: getWizard('stop', [
    async (ctx, wizard) => {
      await wizard.next()

      return ctx.sendMessage(
        'Tem certeza que deseja apagar **_todos_** os seus dados? Essa operação não é reversível',
        true,
        CONFIRM
      )
    },
    async (ctx, wizard) => {
      if (ctx.message.text === 'Sim') {
        await wizard.exit()
        await ctx.repository.forget(ctx.user.telegramId)

        return ctx.sendMessage('OK. Apaguei tudo que eu sabia sobre você :)', false, REMOVE_KEYBOARD)
      }

      if (ctx.message.text === 'Não') {
        await wizard.exit()

        return ctx.sendMessage('OK, deixa pra lá', false, REMOVE_KEYBOARD)
      }

      return ctx.sendMessage(
        'Hm... Não entendi. Por favor, utilize um dos botões pra me responder.',
        false,
        REMOVE_KEYBOARD
      )
    }
  ])
}

export default stop
