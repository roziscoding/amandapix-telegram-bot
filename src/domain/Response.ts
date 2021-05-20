import { InputFile, Params, Telegram } from 'typegram'

export type Response<TMethod extends keyof Telegram> = {
  method: TMethod
} & Params<TMethod, InputFile>[ 0 ]
