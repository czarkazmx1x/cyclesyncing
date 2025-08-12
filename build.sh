#!/bin/bash

# Clean any previous builds
rm -rf .next
rm -rf out

# Build with Next.js
npm run build

# Check if .next/standalone directory exists (for non-static builds)
if [ -d ".next/standalone" ]; then
  echo "Found .next/standalone directory"
  mkdir -p out
  cp -r .next/standalone/* out/
fi

# Check if .next/static directory exists
if [ -d ".next/static" ]; then
  echo "Found .next/static directory"
  mkdir -p out/_next/static
  cp -r .next/static/* out/_next/static/
fi

# If no output directory exists yet, manually create the structure
if [ ! -d "out" ]; then
  echo "Creating output directory manually"
  mkdir -p out
  
  # Copy .next build output to out directory
  if [ -d ".next" ]; then
    cp -r .next/* out/
    
    # Remove cache files to reduce size
    rm -rf out/cache
    
    # Create public directory
    mkdir -p out/public
    if [ -d "public" ]; then
      cp -r public/* out/public/
    fi
  fi
fi

# Verify out directory has content
if [ -d "out" ]; then
  echo "Output directory 'out' created with content:"
  ls -la out/
  
  # Create a basic index.html if it doesn't exist
  if [ ! -f "out/index.html" ]; then
    echo "Creating basic index.html"
    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CycleSync App</title><link rel="stylesheet" href="/_next/static/css/app.css"></head><body><div id="__next"><h1>CycleSync App</h1><p>Loading...</p></div><script src="/_next/static/chunks/main.js"></script></body></html>' > out/index.html
  fi
else
  echo "Failed to create output directory!"
fi

# Make sure Cloudflare Pages can find the output
echo "Final directory structure:"
ls -la