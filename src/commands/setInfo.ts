import { Command } from '../domain/Command'
import { REMOVE_KEYBOARD } from '../util/telegram/sendMessage'
import { getWizard } from '../util/telegram/wizard'

const setInfo: Command = {
  name: 'setinfo',
  helpText: 'Define suas informações do Pix',
  regex: /\/setinfo(?: (?<key>.*), ?(?<city>.*), ?(?<name>.*))?/,
  fn: getWizard('setinfo', [
    async (ctx, wizard) => {
      await wizard.next()
      return ctx.sendMessage('Bora ajeitar esses dados do Pix! Primeiro, me manda sua chave:')
    },
    async (ctx, wizard) => {
      await wizard.next({ key: ctx.message.text })
      return ctx.sendMessage('Show! Agora, me manda sua cidade:')
    },
    async (ctx, wizard) => {
      await wizard.next({ city: ctx.message.text })
      return ctx.sendMessage('Boa! Por último, me diz seu nome:')
    },
    async (ctx, wizard) => {
      await wizard.next({ name: ctx.message.text })
      const sessionData = ctx.user.session?.data || {}

      const message = `Bom, pelo que eu entendi, seus dados são:\n\n\`Chave: ${sessionData.key}\`\n\`Cidade: ${sessionData.city}\`\n\`Nome: ${ctx.message.text}\`\n\nTá correto?`

      return ctx.sendMessage(message, true, {
        keyboard: [[{ text: 'Sim' }], [{ text: 'Não' }], [{ text: 'Cancelar' }]],
        one_time_keyboard: true,
        resize_keyboard: true
      })
    },
    async (ctx, wizard) => {
      if (ctx.message.text === 'Cancelar') {
        await wizard.exit()
        return ctx.sendMessage(          
          'OK, deixa pra lá. Até mais!',
          false,
          REMOVE_KEYBOARD
        )
      }

      if (ctx.message.text === 'Não') {
        await wizard.setStep(1)

        return ctx.sendMessage(          
          'Ok, vamos do começo então. Me manda sua chave Pix:',
          false,
          REMOVE_KEYBOARD
        )
      }

      if (ctx.message.text === 'Sim') {
        const { key, city, name, amount } = ctx.user.session!.data!

        await ctx.repository.setInfo(ctx.user.telegramId, key, city, name)
        await wizard.exit()

        const text = amount ? `Gerar código de ${amount} reais` : 'Gerar código Pix'

        return ctx.sendMessage(          
          'Tudo certo! Você já pode gerar códigos Pix! Pra isso, me chama inline, ou clica no botão :D',
          false,
          {
            inline_keyboard: [[{ text, switch_inline_query: amount || '' }]],
            remove_keyboard: true
          }
        )
      }

      return ctx.sendMessage(        
        'Hm... Não entendi. Clica em um dos botões, por favor.'
      )
    }
  ])
}

export default setInfo
