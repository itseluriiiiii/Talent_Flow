# TalentFlow - HR Management System

A modern, responsive HR platform built with **React, TypeScript, and Tailwind CSS** for managing candidates, employees, onboarding/offboarding, and HR analytics.

## Features
- **Dashboard:** Real-time HR metrics  
- **Candidate & Employee Management:** Track records, onboarding/offboarding  
- **Interview Scheduling:** Organize interviews  
- **Document Management:** Upload & verify HR documents  
- **Analytics & Reporting:** Role-based insights for HR managers, department heads, and employees  

## Tech Stack
- **Frontend:** React 18 + TypeScript  
- **Styling:** Tailwind CSS  
- **State Management:** React Query  
- **Routing:** React Router v6  
- **Charts & UI Components:** Recharts, Radix UI, Lucide React  

## Responsive Design
- Mobile: Sidebar hidden, single-column layouts  
- Tablet: Sidebar visible, 2-column grids  
- Desktop: Collapsible sidebar, 3-4 column layouts, max width `7xl`  
- Touch-friendly, mobile-first, smooth animations, lazy-loaded components  

## Design System

Our design is based on a clean, modern, and accessible HR interface with consistent UI patterns.

###  Color Palette
- Primary: #8B5CF6 (Purple)
- Secondary: Soft Lavender background
- Accents: Blue, Green, Yellow, Red for status badges
- Neutral greys for text hierarchy

###  Typography
- **Inter** – clean, geometric sans-serif
- Consistent font sizes using Tailwind’s scale

###  Spacing & Layout
- 8px spacing grid system
- Fluid responsive containers up to `max-w-7xl`
- Card-based UI with soft shadows and rounded corners (`rounded-xl`, `rounded-2xl`)

### Components
Reusable components designed:
- Navigation sidebar  
- Top search bar  
- Candidate cards  
- Employee cards  
- Interview cards  
- Modals, inputs, buttons  
- Tag badges for skills & statuses  


## Project Structure
```bash
src/
├── components/ # Dashboard, Layout, UI components
├── contexts/ # React contexts
├── data/ # Mock data
├── hooks/ # Custom hooks
├── lib/ # Utilities
├── pages/ # All pages
├── styles/ # Global styles
└── types/ # TypeScript definitions
```

## Getting Started
```bash
npm install        # or bun install
npm run dev        # or bun run dev
```

