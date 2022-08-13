import { Telegram } from 'typegram'
import { Command, Context } from '../../old/domain/Command'
import { Response } from '../../old/domain/Response'
import { Awaitable } from '../types/Awaitable'

type WizardContext = {
  next: (extraData?: any) => Promise<void>
  previous: (extraData?: any) => Promise<void>
  setStep: (stepIndex: number) => Promise<void>
  exit: () => Promise<void>
}

type WizardFn = (ctx: Context, wizardCtx: WizardContext) => Awaitable<Response<keyof Telegram> | null>

export const getWizard =
  (commandName: string, steps: [WizardFn, ...WizardFn[]]): Command['fn'] =>
  (ctx) => {
    const sessionData = ctx.user.session?.data
    const stepIndex = sessionData?.step || 0
    const step = steps[stepIndex]!

    const setSession = async (stepNumber: number, extraData: any = {}) => {
      const sessionData = ctx.user.session?.data || {}
      await ctx.repository.setSesstion(ctx.user.telegramId, commandName, {
        ...sessionData,
        ...extraData,
        step: stepNumber
      })
    }

    const wizardContext: WizardContext = {
      next: async (extraData = {}) => setSession(stepIndex + 1, extraData),
      previous: async (extraData = {}) => setSession(stepIndex > 0 ? stepIndex - 1 : 0, extraData),
      setStep: async (stepIndex) => setSession(stepIndex),
      exit: async () => {
        await ctx.repository.clearSession(ctx.user.telegramId)
      }
    }

    return step(ctx, wizardContext)
  }
