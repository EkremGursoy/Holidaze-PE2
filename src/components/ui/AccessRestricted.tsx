import { Link } from 'react-router'

type AccessRestrictedProps = {
  message: string
}

export default function AccessRestricted({ message }: AccessRestrictedProps) {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="bg-orange-50 border border-orange-200 text-orange-700 px-6 py-8 rounded-2xl text-center">
        <svg className="w-12 h-12 mx-auto mb-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
        <p className="mb-6">{message}</p>
        <Link to="/login" className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  )
}
