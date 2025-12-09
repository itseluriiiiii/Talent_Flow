# TalentFlow - HR Management System

A modern, responsive HR management platform built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Real-time HR metrics and analytics
- **Candidate Management**: Track and manage job candidates through the hiring pipeline
- **Interview Scheduling**: Organize and schedule interviews
- **Employee Management**: Manage employee records and information
- **Onboarding/Offboarding**: Streamline employee onboarding and offboarding processes
- **Document Management**: Store and manage HR documents
- **Analytics**: Comprehensive HR analytics and reporting
- **Role-Based Access**: Different views for HR managers, department managers, and employees

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query for server state
- **Routing**: React Router v6
- **UI Components**: Custom component library with Radix UI
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## Responsive Design

The application is fully responsive and optimized for all device sizes:

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: 1024px - 1280px (lg)
- **Large Desktop**: > 1280px (xl)

### Layout Responsiveness

#### Mobile (< 768px)
- Sidebar is hidden by default and slides in from the left
- Menu button in header to toggle sidebar
- Single column layouts for all content
- Optimized touch targets for mobile interaction
- Overlay appears when sidebar is open

#### Tablet (768px - 1024px)
- Sidebar always visible
- 2-column grid layouts for cards and charts
- Compact spacing for better use of screen real estate
- All navigation items visible

#### Desktop (1024px+)
- Sidebar with collapse/expand toggle
- 3-4 column grid layouts for optimal content distribution
- Maximum content width of 7xl (80rem) for readability
- Increased padding and spacing for better visual hierarchy
- Full-featured header with all controls visible

### Key Responsive Features

1. **Sidebar**
   - Mobile: Slide-in drawer with overlay
   - Desktop: Fixed sidebar with collapse option
   - Smooth animations using CSS transforms
   - Auto-closes on navigation on mobile

2. **Header**
   - Mobile: Menu button only
   - Tablet: Search and role switcher visible
   - Desktop: Full header with all controls
   - Responsive padding: `px-4 md:px-6 lg:px-8`

3. **Content Area**
   - Mobile: Full width with `p-4` padding
   - Tablet: `p-6` padding
   - Desktop: `p-8` padding with max-width constraint
   - Centered content with `max-w-7xl` for large screens

4. **Grid Layouts**
   - Stats cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
   - Charts: `grid-cols-1 lg:grid-cols-2` or `lg:grid-cols-3`
   - Tables: Horizontal scroll on mobile, full width on desktop

5. **Forms and Filters**
   - Mobile: Stacked vertically
   - Desktop: Horizontal layout with proper spacing
   - Responsive select widths: `w-full sm:w-[180px] lg:w-[200px]`

## Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── layout/             # Layout components (AppLayout, Header, Sidebar)
│   └── ui/                 # Reusable UI components
├── contexts/               # React contexts (Auth, etc.)
├── data/                   # Mock data
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── pages/                  # Page components
├── styles/                 # Global styles
└── types/                  # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 16+ or Bun
- npm or yarn or bun

### Installation

```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Responsive Design Implementation

### Mobile-First Approach
The design follows a mobile-first approach where:
1. Base styles are optimized for mobile
2. `sm:`, `md:`, `lg:`, `xl:` prefixes add enhancements for larger screens
3. Progressive enhancement ensures better experience on larger devices

### Performance Optimizations
- GPU-accelerated CSS transforms for smooth animations
- Efficient event listeners with proper cleanup
- Lazy loading of components
- Optimized re-renders with React Query

### Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Key Files

### Layout Components
- `src/components/layout/AppLayout.tsx` - Main layout wrapper with sidebar and header
- `src/components/layout/Header.tsx` - Responsive header with navigation
- `src/components/layout/Sidebar.tsx` - Responsive sidebar with navigation menu

### Pages
- `src/pages/Dashboard.tsx` - Main dashboard with stats and charts
- `src/pages/HRDashboard.tsx` - HR-specific dashboard with detailed metrics
- `src/pages/CandidatesPage.tsx` - Candidate management with filtering and sorting
- `src/pages/Employees.tsx` - Employee management
- `src/pages/Interviews.tsx` - Interview scheduling
- `src/pages/Onboarding.tsx` - Onboarding management
- `src/pages/Offboarding.tsx` - Offboarding management
- `src/pages/Documents.tsx` - Document management
- `src/pages/Analytics.tsx` - Analytics and reporting

## Responsive Testing Checklist

- ✅ Mobile (320px - 480px): Sidebar toggle, single column layouts
- ✅ Tablet (640px - 1024px): 2-column grids, visible sidebar
- ✅ Desktop (1024px+): 3-4 column grids, collapse toggle
- ✅ Large Desktop (1280px+): Full-width content with max-width constraint
- ✅ Landscape orientation: Proper layout adaptation
- ✅ Touch interactions: Optimized for mobile
- ✅ Sidebar toggle: Works on all screen sizes
- ✅ Navigation: Accessible on all devices
- ✅ Forms: Responsive input fields
- ✅ Tables: Horizontal scroll on mobile

