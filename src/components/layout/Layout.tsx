import { Link, Outlet } from 'react-router'

export default function Layout() {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/venue/1">Venue Details</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/create-venue">Create Venue</Link>
            </li>
            <li>
              <Link to="/update-venue/1">Update Venue</Link>
            </li>
            <li>
              <Link to="/my-venues">My Venues</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
