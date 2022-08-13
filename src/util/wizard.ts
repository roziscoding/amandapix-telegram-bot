import { Router } from '@grammyjs/router'
import { Context, MiddlewareFn, SessionFlavor } from 'grammy'

const internal = Symbol('wizard')

type Internals<C extends Context> = {
  wizards: Map<string, Array<WizardStep<C>>>
}

export type WizardSessionData = {
  wizard?: {
    id: string
    step: number
  }
}

export type WizardStep<C extends Context> = (wizard: Wizard<C>, ctx: C) => unknown | Promise<unknown>

export type WizardFlavor<C extends Context = Context> = {
  wizard: WizardControls<C>
} & SessionFlavor<WizardSessionData>

export type WizardDefinition<C extends Context> = {
  id: string
  handler: MiddlewareFn<C & WizardFlavor>
}

class Wizard<C extends Context> {
  constructor(private readonly ctx: C & WizardFlavor) {
    if (!ctx.session.wizard) {
      throw new Error('Wizard data not found in session.')
    }
  }

  next() {
    this.ctx.session.wizard!.step += 1
  }

  previous() {
    this.ctx.session.wizard!.step -= 1
  }

  setStep(step: number) {
    this.ctx.session.wizard!.step = step
  }

  exit() {
    delete this.ctx.session.wizard
  }
}

class WizardControls<C extends Context> {
  readonly [internal]: Internals<C> = { wizards: new Map() }

  constructor(private readonly session: WizardSessionData) {}

  enter(id: string, extra: { step?: number } = {}) {
    const { step = 0 } = extra
    this.session.wizard = { id, step }
  }

  exit() {
    delete this.session.wizard
  }
}

export function wizards<C extends Context>(
  wizards: Array<WizardDefinition<C>>
): [MiddlewareFn<C & WizardFlavor>, Router<C & WizardFlavor>] {
  // Why doesn't TypeScript accepts that `C` satisfies `Context`?
  const router = new Router<Context & C & WizardFlavor>((ctx) => ctx.session.wizard?.id)

  for (const wizardDefinition of wizards) {
    router.route(wizardDefinition.id, wizardDefinition.handler)
  }

  return [
    async (ctx, next) => {
      if (!('session' in ctx)) {
        throw new Error('Cannot use wizards without session!')
      }

      ctx.wizard ??= new WizardControls(ctx.session)

      await next()
    },
    router
  ]
}

export function createWizard<C extends Context>(id: string, steps: Array<WizardStep<C>>): WizardDefinition<C> {
  const handler: MiddlewareFn<C & WizardFlavor> = async (ctx, next) => {
    const stepIndex = ctx.session.wizard?.step ?? 0

    const step = steps[stepIndex]
    if (!step) {
      throw new Error(`Wizard ${id} does not have a step with index ${stepIndex}`)
    }

    await step(new Wizard(ctx), ctx)
    return next()
  }

  return {
    id,
    handler
  }
}
