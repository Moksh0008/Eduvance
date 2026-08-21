import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { StartPreparingButton } from '../../components/auth/StartPreparingButton'
import { Reveal } from './Reveal'

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-accent/[0.04] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-serif text-4xl text-ink sm:text-5xl">Stop planning your studies. Start optimizing them.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-2">
            Configure your exams once. Eduvance keeps the strategy honest as performance and time change.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <StartPreparingButton size="lg" continueLabel="Continue Preparing" />
            <Button as={Link} to="/login?next=/dashboard" variant="secondary" size="lg">
              Open dashboard
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
