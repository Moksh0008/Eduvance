import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import EduvanceMascot from '../components/mascot/EduvanceMascot'

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const inputRefs = useRef([])
  const navigate = useNavigate()
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setMessage('Email verified! Redirecting...')
        if (data.token) localStorage.setItem('eduvance.auth', JSON.stringify({ token: data.token, user: data.user }))
        setTimeout(() => navigate('/dashboard'), 2000)
      } else {
        setError(data.message || 'Invalid code. Please try again.')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.success) {
        setMessage('New code sent! Check your email.')
        setCountdown(60)
      } else {
        setError(data.message || 'Failed to resend code.')
      }
    } catch {
      setError('Network error.')
    } finally {
      setResending(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="text-center">
          <div className="mb-6 text-5xl">✅</div>
          <h1 className="mb-2 text-2xl font-semibold text-ink">Email Verified!</h1>
          <p className="text-ink-3">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-glass bg-glass p-8 shadow-lg backdrop-blur-sm">
          <div className="mb-6 flex justify-center">
            <EduvanceMascot size={80} mood="happy" />
          </div>
          <h1 className="mb-2 text-center text-2xl font-semibold text-ink">Verify your email</h1>
          <p className="mb-1 text-center text-sm text-ink-3">
            We sent a 6-digit code to
          </p>
          <p className="mb-6 text-center text-sm font-medium text-accent">{email}</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex justify-center gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className="h-12 w-12 rounded-lg border border-glass bg-canvas text-center text-lg font-semibold text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              ))}
            </div>

            {error && (
              <p className="mb-4 text-center text-sm text-red-500">{error}</p>
            )}
            {message && !error && (
              <p className="mb-4 text-center text-sm text-green-600">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="mb-4 w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-3">
            Didn't receive a code?{' '}
            <button
              onClick={handleResend}
              disabled={resending || countdown > 0}
              className="font-medium text-accent hover:underline disabled:opacity-50"
            >
              {resending
                ? 'Sending...'
                : countdown > 0
                ? `Resend in ${countdown}s`
                : 'Resend code'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
