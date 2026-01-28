import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { registerUser, loginUser } from '../services/authService'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isVenueManager, setIsVenueManager] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): string | null => {
    if (!name.trim()) {
      return 'Name is required'
    }

    if (!/^[\w]+$/.test(name)) {
      return 'Name can only contain letters, numbers, and underscores'
    }

    if (!email.endsWith('@stud.noroff.no')) {
      return 'Email must be a valid @stud.noroff.no address'
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters'
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      await registerUser({
        name: name.trim(),
        email,
        password,
        venueManager: isVenueManager,
      })

      const user = await loginUser({ email, password })
      await login(user)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-stone-100 shadow-xl shadow-orange-100/30 p-8 md:p-10">
          <div className="text-center mb-8">
            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
              Get started
            </span>
            <h1 className="text-3xl font-black text-stone-800 tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-stone-500">
              Join Holidaze and start booking amazing venues
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-stone-700 mb-2">
                Username
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your_username"
                required
                className="w-full px-5 py-3.5 rounded-xl text-stone-800 bg-stone-50 border border-stone-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all placeholder-stone-400"
              />
              <p className="mt-1.5 text-xs text-stone-400">
                Only letters, numbers, and underscores allowed
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@stud.noroff.no"
                required
                className="w-full px-5 py-3.5 rounded-xl text-stone-800 bg-stone-50 border border-stone-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all placeholder-stone-400"
              />
              <p className="mt-1.5 text-xs text-stone-400">
                Must be a @stud.noroff.no email
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-stone-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="w-full px-5 py-3.5 rounded-xl text-stone-800 bg-stone-50 border border-stone-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all placeholder-stone-400"
              />
              <p className="mt-1.5 text-xs text-stone-400">
                Minimum 8 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-stone-700 mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full px-5 py-3.5 rounded-xl text-stone-800 bg-stone-50 border border-stone-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all placeholder-stone-400"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isVenueManager}
                  onChange={(e) => setIsVenueManager(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-stone-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                />
                <div className="ml-3">
                  <span className="font-semibold text-stone-700 group-hover:text-stone-900 transition-colors">
                    Register as Venue Manager
                  </span>
                  <p className="text-xs text-stone-400 mt-0.5">
                    You'll be able to create and manage venues
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-stone-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
