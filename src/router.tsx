import { createBrowserRouter } from 'react-router'
import Layout from './components/layout/Layout'
import CreateVenuePage from './pages/CreateVenuePage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyVenuesPage from './pages/MyVenuesPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import UpdateVenuePage from './pages/UpdateVenuePage'
import VenueDetailsPage from './pages/VenueDetailsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'venue/:id', element: <VenueDetailsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'create-venue', element: <CreateVenuePage /> },
      { path: 'update-venue/:id', element: <UpdateVenuePage /> },
      { path: 'my-venues', element: <MyVenuesPage /> },
    ],
  },
])
