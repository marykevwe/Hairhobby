# Tressly — Frontend (React + Vite + Tailwind CSS)

The client app for Tressly, a worldwide booking marketplace for stylists, barbers,
wig sellers, wig ventilators, makeup artists and nail technicians. This app talks
to the Tressly API in `../backend` — see that folder's README to get the API
running first.

## Getting started

```bash
cp .env.example .env   # point VITE_API_URL at your running API if not on localhost:5000
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). Make sure the
backend (`../backend`) is running on the URL set in `.env`, or login/signup and
all data fetching will fail.

To build for production:

```bash
npm run build
npm run preview
```

## Demo accounts

Seed the backend first (`npm run seed` inside `../backend`) to get these working logins:

| Role         | Email                  | Password      |
|--------------|-------------------------|---------------|
| Admin        | admin@tressly.com       | admin123      |
| Professional | pro-1@tressly.com       | password123   |
| Client       | client@tressly.com      | client123     |

The login page also has one-click buttons to fill these in.

## Features

**Home page**
- Auto-rotating hero carousel of signature looks with an inline search bar (service, country, city)
- Horizontally scrollable "Browse by look" style gallery — click any style to jump to filtered results
- Service-category grid (Hair Stylist, Barber, Wig Seller, Wig Ventilator, Makeup Artist, Nail Technician)
- Top-rated professionals (live from the API), "how it works" steps, and a call-to-action for new professionals

**Clients**
- Sign up with country → region/state → city (worldwide, expandable in `src/data/locations.js` —
  keep `backend/src/utils/locations.js` in sync if you add locations)
- Explore/search page with filters (service, country, city) and a "my location" selector that
  asks the API to sort results by real geospatial distance (MongoDB `$geoNear`) and centers an embedded map
- Professional profile pages with bio, services & pricing, an embedded location map, and reviews
- Book an appointment (service, date, time, note) and track booking status from a personal dashboard
- Leave star ratings & written reviews on a professional's profile

**Professionals**
- Register a business with category, location and login credentials (creates the listing server-side)
- Dashboard with Overview (stats & earnings), Services (add/edit/delete with price, currency & duration),
  Bookings (confirm, decline, mark completed), and editable public Profile (bio, avatar, cover photo)

**Admin**
- Platform-wide dashboard: verify or remove professional listings, suspend or delete client accounts,
  view every booking on the platform, and moderate/remove reviews

**Design**
- Tailwind theme built around the supplied `brand` pink/rose palette and `soft` shadow
- `Fraunces` (display) + `Inter` (body) typography pairing
- Fully responsive: mobile nav, responsive grids, touch-friendly carousels

## How data flows

All server communication goes through `src/api/*.js` (thin `fetch` wrappers) and
two React contexts:

- `AuthContext` — holds the logged-in user, stores the JWT in `localStorage`,
  and restores the session on page load via `GET /api/auth/me`.
- `DataContext` — exposes async functions (`fetchPros`, `createBooking`,
  `addReview`, etc.) that call the API and normalize MongoDB's `_id` into the
  `id` field components expect (see `src/utils/normalize.js`).

Pages fetch their own data in a `useEffect` and keep local loading state —
nothing is preloaded into global state besides the professionals cache used on
the Home and Explore pages.

## Notes on maps

Location maps use Google Maps' key-free `?q=` embed (no API key required) centered on each
professional's city/region/country. For production you may want to swap this for the full
Google Maps JavaScript API (or Mapbox/Leaflet) with real geocoded addresses and pins.

## Project structure

```
src/
  api/          fetch wrappers: client.js, auth.js, pros.js, bookings.js, reviews.js, admin.js
  components/   Navbar, Footer, HeroCarousel, StyleCard, ProCard, MapView, BookingModal, etc.
  context/      AuthContext (session), DataContext (API calls + pros cache)
  data/         locations.js (world countries/regions/cities), mockData.js (categories, styles)
  pages/        Home, SearchResults, ProProfile, Login, SignupClient, SignupPro,
                ClientDashboard, ProDashboard, AdminDashboard, NotFound
  utils/        helpers.js (pricing/duration/map URL), normalize.js (Mongo _id → id)
```
