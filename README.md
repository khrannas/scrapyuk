# ScrapYuk - 3D Pop-up Scrapbook Creator

A modern web application for creating stunning 3D pop-up scrapbooks with layered image objects and frame templates.

## 🎯 Project Status

**Phase 1: Project Foundation & Setup** - ✅ **COMPLETED**

All Phase 1 deliverables have been successfully implemented as outlined in the [execution plan](docs/execution-plan.md).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Testing

### Unit Tests (Jest + React Testing Library)
```bash
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

### End-to-End Tests (Playwright)
```bash
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Run E2E tests with UI mode
```

## 🏗️ Tech Stack

- **Frontend**: Next.js 15+ with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Testing**: Jest, React Testing Library, Playwright
- **Fonts**: Inter (body text), Poppins (headings)
- **Icons**: Lucide React
- **3D Rendering**: React Three Fiber (future phases)

## 🎨 Design System

### Colors (Dark Theme)
- **Background**: `#1A1A1A` - Main application background
- **Panel Surface**: `#242424` - Left and right panel backgrounds  
- **Interactive Accent**: `#3B82F6` - Primary buttons, highlights
- **Primary Text**: `#E0E0E0` - Main text color
- **Secondary Text**: `#A0A0A0` - Labels, secondary information

### Typography
- **Body Text**: Inter font family
- **Headings**: Poppins font family (SemiBold weight)

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── layout/         # Layout components (Header, Panels)
│   └── ui/             # shadcn/ui components
├── lib/                # Utility functions and constants
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks (future)

tests/
├── unit/               # Jest unit tests
├── e2e/                # Playwright E2E tests
├── fixtures/           # Test data and mock objects
└── mocks/              # Test mocks and utilities

docs/                   # Project documentation
```

## 🎯 Current Features (Phase 1)

✅ **Complete 3-column layout**:
- Header with save/share controls and edit/view mode toggle
- Left panel for asset management and frame templates
- Main canvas area (3D placeholder)
- Right panel for object properties and controls

✅ **Dark theme design system** with custom colors and typography

✅ **Component library** with shadcn/ui integration

✅ **Testing infrastructure** with Jest and Playwright

✅ **TypeScript** with strict mode and proper type definitions

## 🗺️ Development Roadmap

See the complete [execution plan](docs/execution-plan.md) for all 11 development phases.

### Next Phase: Authentication & Basic UI Layout
- Simple login system with hardcoded credentials
- Protected routes and session management
- Enhanced responsive design
- Navigation between authenticated/unauthenticated states

## 📚 Documentation

- [Execution Plan](docs/execution-plan.md) - Complete development roadmap
- [Design System](docs/design-system.md) - UI/UX specifications
- [Requirements](docs/requirements.md) - Functional requirements
- [Wireframe Concept](docs/wireframe-concept.md) - UI layout concepts
- [Phase 1 Checklist](docs/phase-1-checklist.md) - Detailed progress tracking

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
npm test            # Run unit tests
npm run test:e2e    # Run E2E tests
```

## 📄 License

This project is part of the ScrapYuk MVP development.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
