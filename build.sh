#!/bin/bash

echo "Starting build process for Cloudflare Pages deployment..."

# Clean previous builds
rm -rf .next out
echo "Cleaned previous build artifacts"

# Create empty output directory
mkdir -p out
echo "Created output directory"

# Build the Next.js application
echo "Building Next.js application..."
NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME \
NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
MISTRAL_API_KEY=$MISTRAL_API_KEY \
npm run build

# Check if the build was successful
if [ -d ".next" ]; then
  echo "Next.js build completed successfully"
else
  echo "Next.js build failed. Falling back to static HTML"
  # Copy the static index.html to the output directory
  cp index.html out/index.html
  echo "Using fallback index.html"
  exit 0
fi

# Copy the static output from .next to out
if [ -d ".next/static" ]; then
  echo "Copying static assets..."
  mkdir -p out/_next/static
  cp -r .next/static out/_next/
fi

# Copy all pages from .next/server/pages to out if they exist
if [ -d ".next/server/pages" ]; then
  echo "Copying server pages..."
  mkdir -p out/pages
  cp -r .next/server/pages/* out/
fi

# Copy app directory if it exists
if [ -d ".next/server/app" ]; then
  echo "Copying app directory..."
  mkdir -p out/app
  cp -r .next/server/app/* out/app/
fi

# Copy public assets
if [ -d "public" ]; then
  echo "Copying public assets..."
  cp -r public/* out/
fi

# Create routes configuration for Cloudflare Pages
if [ ! -f "out/_routes.json" ]; then
  echo "Creating _routes.json..."
  cp _routes.json out/_routes.json
fi

# Add an index.html file to the out directory
if [ ! -f "out/index.html" ]; then
  echo "Adding index.html to the output directory..."
  cp index.html out/index.html
fi

echo "Listing files in output directory:"
ls -la out/

echo "Build process completed!"