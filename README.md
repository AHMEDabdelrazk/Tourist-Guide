# GlobalGuide - Enterprise Tourist Guide & Transit Explorer

> A modern, full-stack travel discovery, transit guidance, and itinerary management platform engineered for high complexity and robust evaluation.

---

## 🌟 Key Features

1. **Authentication & Authorization**:
   - Secure JWT Bearer authentication and BCrypt password encryption.
   - User registration, login, and profile tracking.
   - **1-Click Fast-Pass Demo Traveler**: Evaluators can instantly log in to experience a pre-populated travel history and statistics with zero registration friction.

2. **Country Catalog (`CountryTab`)**:
   - Multi-continent explorer featuring **France, Egypt, Germany, Switzerland, United States, and United Arab Emirates**.
   - Rich national metadata: national flags, capitals, languages, currencies, daily budget estimates, and emergency hotlines.
   - Interactive deep-dive into each country revealing curated top attractions.

3. **Top Places & Step-by-Step Transit Instructions (`PlacesTab` & `PlaceDetailModal`)**:
   - Comprehensive attraction dossiers: high-resolution photography, geo-coordinates, ticket pricing in USD, suggested duration, and hours of operation.
   - Dedicated **"How to Go There" Transit Guides**: Specific transit logistics including airport arrival, rail connections, metro line numbers, station names, walking distances, and taxi recommendations.
   - Community reviews and ratings submission.

4. **User Trip History & Itinerary Planner (`TripHistoryTab` & `AddToTripModal`)**:
   - Add any destination directly from the country catalog into personal history.
   - Categorize entries as **Visited ✅**, **Planned 📅**, or **Bucket List ⭐** with 1-click status toggling.
   - Track calendar visit dates, personal journal notes/memories, custom star ratings (1-5), and **actual travel expenditures ($)**.
   - Tag transportation methods (Flight, Scenic Train, Metro, Rental Car, Cruise) and travel companions (Solo, Partner, Family, Friends).

5. **Travel Analytics & Budget Estimator (`TravelAnalyticsTab`)**:
   - Dynamic traveler statistics: Countries Explored, Total Places Logged, Total Spend ($), and Average Rating.
   - Interactive multi-tier trip budget estimator (Backpacker, Moderate, Luxury) for 1 to 30 day stays.
   - Digital Travel Passport with country stamps.

6. **Real-Time Travel Utilities (`TravelToolsTab`)**:
   - Multi-currency exchange rate calculator (USD, EUR, EGP, CHF, AED, GBP, JPY).
   - Real-time destination weather forecast radar for capital cities (Paris, Cairo, Berlin, Bern, New York, Abu Dhabi).

---

## 🏗️ Architecture & Technology Stack

- **Backend**: Clean Architecture with ASP.NET Core 9 Web API
  - `TouristGuide.Core`: Domain Entities, Enums, DTOs, Repository Interfaces, Service Contracts.
  - `TouristGuide.Infrastructure`: EF Core DbContext, SQLite Database, Database Seeder, Repository Implementations, BCrypt/JWT Authentication Service.
  - `TouristGuide.API`: RESTful Controllers, Swagger/OpenAPI with Bearer token security, CORS, automatic DB migration and seeding.
  - `TouristGuide.Tests`: Automated xUnit test suite with in-memory database testing (100% pass rate).
- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS
  - Custom Auth Context, Lucide travel icons, responsive layouts, glassmorphism aesthetics.
  - Type-safe API communication with localStorage JWT persistence.

---

## 🚀 How to Run

### Quick Start (Windows)
Double-click or run:
```cmd
start.bat
```

### Manual Execution

#### 1. Start Backend API:
```bash
cd TouristGuide.API
dotnet run --urls=http://localhost:5000
```
- API Endpoint: `http://localhost:5000`
- Swagger UI Documentation: `http://localhost:5000/swagger`
- The SQLite database (`touristguide.db`) is automatically created and seeded on initial startup!

#### 2. Start Frontend React App:
```bash
cd TouristGuide.React
npm install
npm run dev
```
- Frontend Application: `http://localhost:5173`

#### 3. Run Automated Tests:
```bash
dotnet test
```

---

## 👤 Pre-configured Demo Accounts

- **Username**: `demo_traveler`
- **Password**: `Password123!`
- *Or simply click the **"Demo User"** button in the top navigation bar or login modal!*
