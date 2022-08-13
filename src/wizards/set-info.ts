import { InlineKeyboard, Keyboard } from 'grammy'
import { AppContext } from '../bot'
import { evaluateQuery } from '../old/handleInlineQuery'
import { createWizard } from '../util/wizard'

export default createWizard<AppContext>('setInfo', [
  async (wizard, ctx) => {
    wizard.next()
    await ctx.reply('Bora ajeitar esses dados do Pix! Primeiro, me manda sua chave:')
  },
  async (wizard, ctx) => {
    const key = ctx.message?.text

    if (!key) {
      await ctx.reply('Me manda sua chave Pix numa mensagem de texto, por favor :)')
      return
    }

    ctx.session.pixKey = key
    wizard.next()
    await ctx.reply('Show! Agora, me manda sua cidade:')
  },
  async (wizard, ctx) => {
    const city = ctx.message?.text

    if (!city) {
      await ctx.reply('Me manda sua cidade numa mensagem de texto, por favor :)')
      return
    }

    ctx.session.city = city
    wizard.next()
    await ctx.reply('Boa! Por último, me diz seu nome:')
  },
  async (wizard, ctx) => {
    const name = ctx.message?.text

    if (!name) {
      await ctx.reply('Me manda seu nome numa mensagem de texto, por favor :)')
      return
    }

    ctx.session.name = name
    wizard.next()

    const { pixKey, city } = ctx.session
    const message = `Bom, pelo que eu entendi, seus dados são:\n\n\`Chave: ${pixKey}\`\n\`Cidade: ${city}\`\n\`Nome: ${name}\`\n\nTá correto?`

    const keyboard = new Keyboard().text('Sim').row().text('Não').row().text('Cancelar')

    await ctx.reply(message, { parse_mode: 'MarkdownV2', reply_markup: keyboard })
  },
  async (wizard, ctx) => {
    const text = ctx.message?.text
    if (!text) {
      return ctx.reply('Por favor, utilize um dos botões pra me responder :)')
    }

    if (text === 'Cancelar') {
      wizard.exit()
      return ctx.reply('OK, deixa pra lá. Até mais!', { reply_markup: { remove_keyboard: true } })
    }

    if (text === 'Não') {
      wizard.setStep(1)

      return ctx.reply('Ok, vamos do começo então. Me manda sua chave Pix:', {
        reply_markup: { remove_keyboard: true }
      })
    }

    if (text === 'Sim') {
      await wizard.exit()
      await ctx.reply('Entendi! Só mais um minuto...', { reply_markup: { remove_keyboard: true } })

      const query = ctx.session.query
      const amount = query ? await evaluateQuery(query) : 0

      const buttonText = query ? `Gerar código de R$ ${amount.toFixed(2)}` : 'Gerar código Pix'
      return ctx.reply('Tudo certo! Você já pode gerar códigos Pix! Pra isso, me chama inline, ou clica no botão :D', {
        reply_markup: new InlineKeyboard().switchInline(buttonText)
      })
    }

    return ctx.reply('Não entendi... Por favor, clique em um dos botões para responder')
  }
])
