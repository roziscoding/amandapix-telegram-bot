export type User = {
  telegramId: number
  pixKey: string
  city: string
  name: string
  session?: {
    command: string,
    data?: any
  }
}
