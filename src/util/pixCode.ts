import { pix } from 'pix-me'
import { AppSession } from '../bot'

export function getPixCodeForUser(user: AppSession, value: string | number) {
  return pix({
    key: user.pixKey,
    amount: typeof value === 'number' ? value.toFixed(2) : value,
    city: user.city.normalize('NFD').replace(/\p{Diacritic}/gu, ''),
    name: user.name.normalize('NFD').replace(/\p{Diacritic}/gu, '')
  })
}
