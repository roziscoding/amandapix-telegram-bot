import { Command } from '../domain/Command'
import { REMOVE_KEYBOARD, sendMessage } from '../util/telegram/sendMessage'

const steps: Command['fn'][] = [
  async (ctx) => {
    await ctx.repository.setSesstion(ctx.user.telegramId, 'setInfo', {
      step: 1
    })
    return sendMessage(
      ctx.user.telegramId,
      'Bora ajeitar esses dados do Pix! Primeiro, me manda sua chave:'
    )
  },
  async (ctx) => {
    const sessionData = ctx.user.session?.data || {}
    await ctx.repository.setSesstion(ctx.user.telegramId, 'setInfo', {
      ...sessionData,
      step: 2,
      key: ctx.message.text
    })
    return sendMessage(ctx.user.telegramId, 'Show! Agora, me manda sua cidade:')
  },
  async (ctx) => {
    const sessionData = ctx.user.session?.data || {}
    await ctx.repository.setSesstion(ctx.user.telegramId, 'setInfo', {
      ...sessionData,
      step: 3,
      city: ctx.message.text
    })
    return sendMessage(ctx.user.telegramId, 'Boa! Por último, me diz seu nome:')
  },
  async (ctx) => {
    const sessionData = ctx.user.session?.data || {}

    await ctx.repository.setSesstion(ctx.user.telegramId, 'setInfo', {
      ...sessionData,
      step: 4,
      name: ctx.message.text
    })

    const message = `Bom, pelo que eu entendi, seus dados são:\n\n\`Chave: ${sessionData.key}\`\n\`Cidade: ${sessionData.city}\`\n\`Nome: ${ctx.message.text}\`\n\nTá correto?`

    return sendMessage(ctx.user.telegramId, message, true, {
      keyboard: [ [ { text: 'Sim' } ], [ { text: 'Não' } ], [ { text: 'Cancelar' } ] ],
      one_time_keyboard: true,
      resize_keyboard: true
    })
  },
  async (ctx) => {
    if (ctx.message.text === 'Cancelar') {
      await ctx.repository.clearSession(ctx.user.telegramId)
      return sendMessage(
        ctx.user.telegramId,
        'OK, deixa pra lá. Até mais!',
        false,
        REMOVE_KEYBOARD
      )
    }

    if (ctx.message.text === 'Não') {
      const sessionData = ctx.user.session?.data || {}
      await ctx.repository.setSesstion(ctx.user.telegramId, 'setInfo', {
        ...sessionData,
        step: 1
      })

      return sendMessage(
        ctx.user.telegramId,
        'Ok, vamos do começo então. Me manda sua chave Pix:',
        false,
        REMOVE_KEYBOARD
      )
    }

    if (ctx.message.text === 'Sim') {
      const { key, city, name, amount } = ctx.user.session!.data!

      await ctx.repository.setInfo(ctx.user.telegramId, key, city, name)
      await ctx.repository.clearSession(ctx.user.telegramId)

      const text = amount
        ? `Gerar código de ${amount} reais`
        : 'Gerar código Pix'
      
      return sendMessage(
        ctx.user.telegramId,
        'Tudo certo! Você já pode gerar códigos Pix! Pra isso, me chama inline, ou clica no botão :D',
        false,
        {
          inline_keyboard: [ [ { text, switch_inline_query: amount || '' } ] ],
          remove_keyboard: true
        }
      )
    }

    return sendMessage(
      ctx.user.telegramId,
      'Hm... Não entendi. Clica em um dos botões, por favor.'
    )
  }
]

const setInfo: Command = {
  name: 'setinfo',
  helpText: 'Define suas informações do Pix. Uso: /setinfo chave, cidade, nome',
  regex: /\/setinfo(?: (?<key>.*), ?(?<city>.*), ?(?<name>.*))?/,
  fn: async (ctx) => {
    const sessionData = ctx.user.session?.data
    const step = steps[sessionData?.step]

    if (!sessionData || !step) return steps[0]!(ctx)

    return step(ctx)
  }
}

export default setInfo
