import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthNav } from '../components/layout/MarketingNav'
import { Button } from '../components/ui/Button'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('moksh@eduvance.app')

  function onSubmit(e) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNav />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-4xl text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-ink-2">UI only — no authentication in this phase. Continue opens the dashboard.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
          <Field id="password" label="Password" type="password" defaultValue="••••••••" />
          <Button type="submit" className="w-full" size="lg">
            Continue
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink-2">
          New here?{' '}
          <Link to="/register" className="font-medium text-accent hover:underline">
            Create an account
          </Link>
        </p>
      </main>
    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()

  function onSubmit(e) {
    e.preventDefault()
    navigate('/setup')
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNav />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-4xl text-ink">Start preparing</h1>
        <p className="mt-2 text-sm text-ink-2">Create a student profile, then configure exams and available hours.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field id="name" label="Full name" defaultValue="Moksh" />
          <Field id="email" label="Email" type="email" defaultValue="moksh@eduvance.app" />
          <Field id="password" label="Password" type="password" defaultValue="••••••••" />
          <Button type="submit" className="w-full" size="lg">
            Continue to setup
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink-2">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </p>
      </main>
    </div>
  )
}

function Field({ id, label, type = 'text', value, onChange, defaultValue }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-3">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="mt-1.5 h-11 w-full border border-line bg-surface px-3 text-sm text-ink outline-none focus:border-accent"
      />
    </label>
  )
}
