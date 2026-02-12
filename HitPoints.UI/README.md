# Hit Points UI

A React + TypeScript + Vite application for managing D&D character hit points.

## Features

- Display character information (name, class, level)
- Show current/max hit points with visual progress bar
- Display temporary hit points
- Show all character stats (STR, DEX, CON, INT, WIS, CHA)
- List items affecting stats
- Responsive design for mobile and desktop

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Running HitPointsService.API on `http://localhost:5000`

## Installation

```bash
cd HitPoints.UI
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── CharacterCard.tsx
│   └── CharacterCard.module.css
├── services/           # API services
│   └── characterService.ts
├── types/              # TypeScript type definitions
│   └── character.ts
├── App.tsx             # Main application component
├── App.css             # Application styles
└── main.tsx            # Application entry point
```

## API Integration

The application connects to the HitPointsService.API at `http://localhost:5000` and uses the following endpoints:

- `GET /characters` - Fetch all characters
- `POST /characters/damage` - Deal damage to a character
- `POST /characters/heal` - Heal a character
- `POST /characters/temporary-hit-points` - Add temporary hit points

## Technologies

- React 18
- TypeScript
- Vite
- CSS Modules
