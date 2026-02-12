# Holidaze - Accommodation Booking Site

A modern front-end accommodation booking application built for the Noroff Project Exam 2. Holidaze allows customers to browse and book venues, while venue managers can register and manage their properties and bookings.

## Description

Holidaze is a full-featured accommodation booking platform with two user roles:

- **Customers** can browse venues, search for specific properties, view availability calendars, create bookings, and manage their upcoming reservations.
- **Venue Managers** can create, edit, and delete venues, and view bookings for their managed properties.

All users can view venue listings, search venues, view individual venue details, and see a calendar with available/booked dates.

## Built With

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [React Router 7](https://reactrouter.com/)
- [Noroff Holidaze API v2](https://docs.noroff.dev/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/holidaze-pe2.git
   cd holidaze-pe2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_API_BASE_URL=https://v2.api.noroff.dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start development server       |
| `npm run build`   | Build for production           |
| `npm run preview` | Preview production build       |
| `npm run lint`    | Run ESLint                     |

## User Stories

### All Users
- View a list of Venues
- Search for a specific Venue
- View a Venue page by ID
- Register as a Customer or Venue Manager (stud.noroff.no email required)
- View a calendar with available and booked dates

### Customers
- Log in and log out
- Create a booking
- View upcoming bookings
- Update avatar/profile picture

### Venue Managers
- Log in and log out
- Create, edit, and delete a Venue
- View upcoming bookings for managed Venues
- Update avatar/profile picture

## Contact

Feel free to reach out for questions or feedback.
