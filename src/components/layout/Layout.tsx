import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-800 antialiased selection:bg-orange-100 selection:text-orange-900">
      <Navbar />
      <main className="grow container mx-auto px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

