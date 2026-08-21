import { MarketingNav } from '../components/layout/MarketingNav'
import { Hero } from '../sections/landing/Hero'
import { Problem } from '../sections/landing/Problem'
import { ChaosToClarity } from '../sections/landing/ChaosToClarity'
import { Comparison } from '../sections/landing/Comparison'
import { HowItWorks } from '../sections/landing/HowItWorks'
import { Prioritization } from '../sections/landing/Prioritization'
import { AdaptivePlanning } from '../sections/landing/AdaptivePlanning'
import { ProgressTracking } from '../sections/landing/ProgressTracking'
import { WhyEduvance } from '../sections/landing/WhyEduvance'
import { FinalCta } from '../sections/landing/FinalCta'

export function LandingPage() {
  return (
    <div className="bg-canvas">
      <MarketingNav />
      <main>
        <Hero />
        <ChaosToClarity />
        <Comparison />
        <Problem />
        <HowItWorks />
        <Prioritization />
        <AdaptivePlanning />
        <ProgressTracking />
        <WhyEduvance />
        <FinalCta />
      </main>
      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-xs text-ink-3 sm:flex-row sm:justify-between sm:px-6">
          <p>Eduvance — Education + Advance</p>
          <p>Adaptive examination preparation & study optimization</p>
        </div>
      </footer>
    </div>
  )
}
