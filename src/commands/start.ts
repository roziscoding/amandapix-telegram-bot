import { Command } from '../domain/Command'

const start: Command = {
  name: 'start',
  regex: /\/start/,
  fn: (ctx) => {
    const { user } = ctx
    const text = user.pixKey
      ? `Opa, beleza? Seus dados atuais são: \`Chave: ${user.pixKey}\nCidade: ${user.city}\nNome: ${user.name}\`. Para alterá-los, envie o comando /setinfo!`
      : 'Olá! Ainda não tenho seus dados. Para defini-los, envie o comando /setinfo!'

    return {
      method: 'sendMessage',
      chat_id: user.telegramId,
      text,
      parse_mode: 'Markdown'
    }
  }
}

export default start
