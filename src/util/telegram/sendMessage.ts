import {
  ForceReply,
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove
} from 'typegram'
import { Response } from '../../domain/Response'

export const REMOVE_KEYBOARD: ReplyKeyboardRemove = {
  remove_keyboard: true
}

export type Markup =
  | InlineKeyboardMarkup
  | ReplyKeyboardMarkup
  | ReplyKeyboardRemove
  | ForceReply

export const sendMessage = (
  id: number,
  text: string,
  markdown = false,
  markup?: Markup
): Response<'sendMessage'> => ({
  method: 'sendMessage',
  chat_id: id,
  text,
  parse_mode: markdown ? 'Markdown' : undefined,
  reply_markup: markup
})
