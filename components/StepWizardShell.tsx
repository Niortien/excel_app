'use client'

// Client Component : les boutons de navigation (précédent/suivant) portent des gestionnaires
// d'événements, ce qui impose un Client Component même si l'essentiel est visuel.
import { IconCheck } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export interface WizardStep {
  id: string
  title: string
}

interface StepWizardShellProps {
  steps: WizardStep[]
  currentStepIndex: number
  onStepChange?: (index: number) => void
  children: React.ReactNode
}

export function StepWizardShell({ steps, currentStepIndex, onStepChange, children }: StepWizardShellProps) {
  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-wrap items-center gap-2" aria-label="Étapes de l'assistant">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex
          const isReachable = onStepChange && index <= currentStepIndex

          return (
            <li key={step.id} className="flex items-center gap-2">
              <button
                type="button"
                disabled={!isReachable}
                onClick={() => onStepChange?.(index)}
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                  isCurrent && 'border-primary bg-primary text-primary-content',
                  !isCurrent && isCompleted && 'border-primary/40 text-primary',
                  !isCurrent && !isCompleted && 'border-base-300 text-base-content/50',
                  !isReachable && 'cursor-default'
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-xs',
                    isCurrent && 'bg-primary-content/20',
                    !isCurrent && 'bg-base-200'
                  )}
                >
                  {isCompleted ? <IconCheck size={13} /> : index + 1}
                </span>
                {step.title}
              </button>
              {index < steps.length - 1 && <span className="h-px w-6 bg-base-300" aria-hidden />}
            </li>
          )
        })}
      </ol>
      <div>{children}</div>
    </div>
  )
}
