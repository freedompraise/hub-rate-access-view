# Hub Rate Access View

A modern, responsive marketing platform for The Creative Kontenthub—showcasing comprehensive marketing services, rate cards, and enabling client engagement through secure access and job applications.

## 🎯 Overview

This is a React + TypeScript application built with Vite, featuring a professional marketing website with:
- **Public Landing Page** - Showcase of services and brand messaging
- **Rate Card Portal** - Secure, token-based access to detailed pricing and service information
- **Job Applications** - Dedicated careers page with form submission and admin dashboard
- **Admin Dashboard** - Management interface for job applications and rate card access requests
- **Responsive Design** - Mobile-first, fully responsive across all devices

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + TSX
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Build**: Vite with TypeScript support
- **Database & Auth**: Supabase (PostgREST API, Storage, Row-Level Security)
- **Routing**: React Router (client-side navigation)
- **Form Management**: React Hook Form with Zod validation
- **Package Manager**: Bun / npm / yarn

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (buttons, cards, forms, etc.)
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── AuthProvider.tsx # Authentication context
│   ├── CareersSection.tsx # Job application modal form
│   ├── AccessRequestModal.tsx # Rate card access request form
│   ├── RateCardSection.tsx # Rate card display component
│   └── ...
├── pages/              # Route page components
│   ├── Index.tsx       # Home page (landing)
│   ├── RateCard.tsx    # Token-gated rate card portal
│   ├── ApplyNow.tsx    # Standalone careers application page
│   ├── Admin.tsx       # Admin access request management
│   ├── CareersAdmin.tsx # Job applications management
│   └── NotFound.tsx    # 404 error page
├── hooks/              # Custom React hooks
│   ├── use-mobile.tsx  # Mobile viewport detection
│   └── use-toast.ts    # Toast notification hook
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client setup and types
├── lib/                # Utility functions
│   └── utils.ts        # Helper functions
├── types/              # TypeScript type definitions
│   └── rate-card.d.ts  # Rate card data types
├── constants/          # Static data
│   └── rate-card.json  # Service rates and packages
├── App.tsx             # Main app component with routing
└── main.tsx            # Entry point

supabase/
├── config.toml         # Supabase project configuration
└── migrations/         # Database migrations (RLS policies, tables)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or Bun)
- Supabase account and project

## 📋 Features

### 🏠 Home Page (`/`)
- Brand introduction and service overview
- Call-to-action sections for rate card requests
- Booking options (Calendly integration)
- Direct contact methods
- Responsive grid layout optimized for desktop first-view visibility

### 💰 Rate Card Portal (`/rate-card`)
- **Token-based Access**: Secure, time-limited access links
- **Comprehensive Pricing**: Organized sections for each service offering
- **Navigation Menu**: Scrollable menu for quick section navigation
- **Services Included**:
  - Marketing Strategy Packages
  - Social Media Management
  - Digital Marketing Management
  - Reel Strategy & Production
  - Campaign Shoots (Photography & Videography)
  - Template Kits
  - Creator Activation Service
  - Strategic Launch Kits
  - Campaign Management Service
  - Strategic Launch & Campaign Execution Kit
  - Paid Ads Management Service
- **Terms & Conditions**: Collapsible accordion for each service
- **CTA Buttons**: Direct contact via WhatsApp or Calendly scheduling

### 💼 Job Applications
- **Public Application Page** (`/apply`): Standalone careers form with no marketing copy
- **Job Form Fields**:
  - Full Name
  - Email
  - Phone Number
  - Role Selection (9 job categories)
  - Resume Upload (Supabase Storage)
  - Consent Checkbox
- **Admin Dashboard** (`/admin/careers`): View, search, and manage all applications
- **Data Security**: RLS policies enforce consent and prevent unauthorized access

### 🔐 Admin Dashboard (`/admin`)
- **Access Request Management**: Review and respond to rate card access requests
- **User-Friendly Interface**: Simple status tracking and messaging
- **Secure Authentication**: Admin-only routes protected by row-level security

### 📱 Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Optimized for all screen sizes (mobile, tablet, desktop)
- Touch-friendly navigation and form inputs
- Prevented viewport scrolling issues on mobile

## 🎨 Design System

### Colors (Tailwind Classes)
- `tkh-purple`: Primary brand color
- `tkh-orange`: Accent color (CTAs, highlights)
- `tkh-teal`: Secondary accent
- `tkh-yellow`: Additional highlight color

### Typography
- **Font Family**: Mix of serif (brand) and sans-serif (body)
- **Headings**: Serif font, bold, responsive sizing
- **Body**: Clean sans-serif for readability

### Components
- Modular UI components from shadcn/ui
- Consistent spacing and padding using Tailwind utilities
- Smooth transitions and hover states

## 🔄 Database & Security

### Supabase Integration
- **Authentication**: Anonymous + authenticated user roles
- **Storage**: Public "Careers" bucket for resume uploads
- **PostgREST API**: Serverless backend for CRUD operations
- **Row-Level Security (RLS)**: Fine-grained access control policies

### RLS Policies
- **job_applications table**:
  - INSERT: Anonymous users can submit with `consent_given = true`
  - SELECT/UPDATE/DELETE: Authenticated users only
- **rate_card_access_requests table**: Authenticated admin access

### Data Privacy
- Sensitive information (emails, phone numbers) protected by RLS
- Token-based rate card access with time expiration
- No personal data exposed in public endpoints

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| react-router-dom | Client-side routing |
| @hookform/resolvers | Form validation |
| react-query | Data fetching & caching |
| @radix-ui/* | Accessible component primitives |
| tailwindcss | Utility-first CSS |
| typescript | Type safety |
| vite | Lightning-fast build tool |
| supabase-js | Backend integration |

## 🛠️ Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Production build
npm run build:dev     # Development mode build
npm run lint          # Run ESLint
npm run preview       # Preview production build
```

## 📋 Configuration Files

- **vite.config.ts**: Vite build configuration
- **tailwind.config.ts**: Tailwind CSS customization with design tokens
- **tsconfig.json**: TypeScript compiler options
- **components.json**: shadcn/ui configuration
- **vercel.json**: Deployment configuration for Vercel

## 🚢 Deployment

The project is configured for Vercel deployment with:
- Automatic builds on git push
- Environment variables managed in Vercel dashboard
- Optimized production builds

**Deploy with Vercel:**
```bash
vercel deploy
```

## 🤝 Contributing

When making changes:
1. Keep components modular and reusable
2. Follow TypeScript strict mode
3. Use Tailwind CSS utilities for styling
4. Maintain accessibility standards (Radix UI primitives)
5. Test responsive behavior across breakpoints

## 📝 Notes

- All copy and brand messaging should be edited directly in component files
- Rate card data is stored in `src/constants/rate-card.json`
- Admin authentication managed through Supabase Auth
- External integrations: Calendly (scheduling), WhatsApp (direct messaging)

## 📞 Support

For issues or questions, refer to:
- Component documentation in `src/components/`
- Type definitions in `src/types/`
- Supabase documentation: https://supabase.com/docs

---

**Built with ❤️ for The Creative Kontenthub**
