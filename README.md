# Cycle Syncing App

A women's health application for tracking menstrual cycles and providing personalized recommendations based on cycle phases.

![Cycle Syncing App](public/screenshot.png)

## Features

- **Cycle Tracking**: Log period dates, symptoms, and mood
- **Phase-Based Recommendations**: Get personalized nutrition, exercise, and self-care recommendations
- **Insights Dashboard**: Visualize cycle patterns and health metrics
- **AI-Powered Support**: Receive mood support and cycle insights powered by AI
- **Educational Resources**: Access information about women's health and hormonal cycles

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/czarkazmx1x/cyclesyncing.git
   cd cyclesyncing
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

- `/app`: Next.js app directory (pages, layouts, routes)
- `/components`: Reusable React components
- `/contexts`: React context providers for state management
- `/lib`: Utility functions and service integrations
- `/public`: Static assets and images
- `/styles`: CSS and Tailwind styling
- `/docs`: Project documentation

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## License

[MIT](LICENSE)
