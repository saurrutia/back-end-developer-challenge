# Running the Application

This guide explains how to run both the backend API and frontend UI.

## Prerequisites

- .NET 10 SDK
- Node.js (v18 or higher)
- npm or yarn

## Backend API

1. Navigate to the project root directory

2. Run the API:
```bash
dotnet run --project HitPointsService.API
```

The API will be available at `http://localhost:5259`

### Verify API is Running

Open your browser and navigate to:
- API Documentation (Scalar): `http://localhost:5259/scalar/v1`
- OpenAPI spec: `http://localhost:5259/openapi/v1.json`

### Available Endpoints

- `GET /characters` - Get all characters
- `POST /characters/damage` - Deal damage to a character
- `POST /characters/heal` - Heal a character
- `POST /characters/temporary-hit-points` - Add temporary hit points

## Frontend UI

1. Navigate to the UI folder:
```bash
cd HitPoints.UI
```

2. Install dependencies (first time only):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The UI will be available at `http://localhost:5173`

**Features:**
- Real-time updates via SignalR (auto-refresh when character data changes)
- Full keyboard navigation and ARIA labels for screen readers
- Responsive design (mobile, tablet, desktop)

### Build for Production

```bash
cd HitPoints.UI
npm run build
```

Preview production build:
```bash
npm run preview
```

## Testing

### Backend Tests

Run all 51 unit tests:
```bash
dotnet test
```

Test coverage:
- Domain layer (22 tests) - damage calculations, resistance/immunity logic, temp HP mechanics
- Application layer (12 tests) - service operations, character management
- Infrastructure layer (17 tests) - data seeding, repository operations

### Frontend Tests

Run UI tests:
```bash
cd HitPoints.UI
npm test
```

Includes component tests with accessibility verification (ARIA labels, keyboard navigation).

## Project Structure

```
├── Characters/                          # Character JSON data files
├── HitPointsService.API/               # Web API layer
├── HitPointsService.Application/       # Application/Service layer
├── HitPointsService.Application.Tests/ # Application layer tests
├── HitPointsService.Domain/            # Domain models and business logic
├── HitPointsService.Domain.Tests/      # Domain layer tests
├── HitPointsService.Infrastructure/    # Data access layer
├── HitPointsService.Infrastructure.Tests/ # Infrastructure layer tests
└── HitPoints.UI/                       # React + TypeScript frontend
```

## Troubleshooting

### CORS Issues

If you see CORS errors in the browser console, ensure:
1. The API is running on `http://localhost:5259`
2. The UI is running on `http://localhost:5173`
3. The CORS policy in `Program.cs` allows requests from the UI origin

### Connection Refused

If the UI cannot connect to the API:
1. Verify the API is running: `http://localhost:5259/characters`
2. Check the API URL in `HitPoints.UI/src/config/api.config.ts`
3. Ensure no firewall is blocking the ports

### Port Already in Use

If port 5259 or 5173 is already in use:
- For API: Change the port in `HitPointsService.API/Properties/launchSettings.json`
- For UI: Vite will automatically suggest the next available port
- You can override API URL with environment variable: `VITE_API_BASE_URL=http://localhost:YOUR_PORT`
