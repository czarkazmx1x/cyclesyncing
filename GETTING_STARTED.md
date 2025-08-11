# Getting Started with Cycle Sync App Development

This guide will help you set up your development environment and get started with the Women's Health Cycle Sync App project.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **PostgreSQL** (for backend development)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, Mac only)
- **React Native CLI**

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cycle-sync-app
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

Create necessary environment files:

```bash
# Create frontend .env file
cp .env.example .env

# Create backend .env file
cd backend
cp .env.example .env
cd ..
```

Edit the `.env` files to set up your local environment variables, including database connection details and API keys.

### 4. Database Setup

```bash
# Navigate to backend directory
cd backend

# Run Prisma migrations
npx prisma migrate dev

# Seed the database with initial data (optional)
npm run seed

cd ..
```

## Running the Application

### Frontend (Mobile App)

```bash
# Start Metro Bundler
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

### Backend (API Server)

```bash
# Navigate to backend directory
cd backend

# Start development server
npm run dev
```

The API server will be available at `http://localhost:3000` by default.

## Development Workflow

### Code Structure

The project follows a modular architecture:

- **Frontend**: React Native with Redux for state management
- **Backend**: Node.js/Express with Prisma ORM

### Key Commands

- `npm run lint` - Check code for style issues
- `npm run test` - Run unit tests
- `npm run build` - Build the application for production

## Troubleshooting

### Common Issues

1. **Metro Bundler Connection Issues**
   - Make sure your device/emulator is on the same network as your development machine
   - Try restarting the Metro Bundler

2. **Database Connection Errors**
   - Verify your PostgreSQL service is running
   - Check your database credentials in the backend `.env` file

3. **Build Errors**
   - Clear cache with `npm start -- --reset-cache`
   - Make sure all dependencies are installed correctly

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/introduction/getting-started)
- [Native Base Documentation](https://docs.nativebase.io/)

## Contributing

Please read the `CONTRIBUTING.md` file for details on our code of conduct and the process for submitting pull requests.