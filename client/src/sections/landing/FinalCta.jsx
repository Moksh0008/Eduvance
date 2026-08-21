import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Reveal } from './Reveal'

export function FinalCta() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-serif text-4xl text-ink sm:text-5xl">Stop planning your studies. Start optimizing them.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-2">
            Configure your exams once. Eduvance keeps the strategy honest as performance and time change.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button as={Link} to="/setup" size="lg">
              Start Preparing
            </Button>
            <Button as={Link} to="/dashboard" variant="secondary" size="lg">
              View live dashboard
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
