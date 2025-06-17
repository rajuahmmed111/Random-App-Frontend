# Product Roadmap App

A modern, interactive roadmap platform built with Next.js 14, TypeScript, and Tailwind CSS. Users can authenticate, upvote features, and engage in threaded discussions about product development.

## Features

### 🔐 Authentication
- Email/password login and signup
- Persistent user sessions
- User profile management

### 🗳️ Interactive Voting
- Upvote roadmap items
- One vote per user per item
- Real-time vote counts

### 💬 Advanced Commenting System
- Nested comments up to 3 levels deep
- Edit and delete own comments
- Character limits for clarity
- Real-time comment counts

### 🎨 Modern UI/UX
- Dark/Light theme support with system detection
- Responsive design for all devices
- Smooth animations and transitions
- Accessible components

### 🔍 Filtering & Search
- Search across titles and descriptions
- Filter by status (Planned, In Progress, Completed)
- Filter by category (UI/UX, Features, Platform, Security)
- Sort by popularity, date, or relevance

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd roadmap-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
roadmap-app/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Main page
│   ├── loading.tsx       # Loading UI
│   └── not-found.tsx     # 404 page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth-form.tsx     # Authentication form
│   ├── comment-section.tsx # Comment system
│   ├── roadmap-header.tsx  # App header
│   ├── roadmap-filters.tsx # Filter controls
│   ├── roadmap-item.tsx    # Individual roadmap items
│   └── theme-toggle.tsx    # Theme switcher
├── lib/                   # Utilities and data
│   ├── types.ts          # TypeScript types
│   ├── mock-data.ts      # Sample data
│   └── utils.ts          # Utility functions
└── hooks/                 # Custom React hooks
    └── use-toast.ts      # Toast notifications
\`\`\`

## Key Components

### Authentication
- Mock authentication system using localStorage
- Form validation and error handling
- Persistent login state

### Roadmap Items
- Read-only items with predefined data
- Status badges and priority indicators
- Upvoting functionality

### Comment System
- Threaded discussions with visual indentation
- CRUD operations for user's own comments
- Character limits and validation

### Theme System
- Light/Dark/System theme options
- Smooth transitions between themes
- Persistent theme preferences

## Customization

### Adding New Roadmap Items
Edit `lib/mock-data.ts` to add new items:

\`\`\`typescript
{
  id: 9,
  title: "New Feature",
  description: "Description of the new feature",
  status: "Planned",
  category: "Features",
  upvotes: 0,
  createdAt: "2024-01-25",
  priority: "Medium",
}
\`\`\`

### Styling
- Modify `app/globals.css` for global styles
- Update `tailwind.config.ts` for theme customization
- Components use Tailwind classes with CSS variables

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
