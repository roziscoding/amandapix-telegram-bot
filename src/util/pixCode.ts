import { User } from '../domain/User'
import { pix } from 'pix-me'

export function getPixCodeForUser(user: User, value: string | number) {
  return pix({
    key: user.pixKey,
    amount: typeof value === 'number' ? value.toFixed(2) : value,
    city: user.city.normalize('NFD').replace(/\p{Diacritic}/gu, ''),
    name: user.name.normalize('NFD').replace(/\p{Diacritic}/gu, '')
  })
}
