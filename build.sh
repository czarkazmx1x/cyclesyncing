#!/bin/bash

# Clean any previous builds
rm -rf .next
rm -rf out

# Build with Next.js
npm run build

# If out directory exists, list its contents
if [ -d "out" ]; then
  echo "Output directory 'out' created successfully"
  ls -la out/
else
  echo "Output directory 'out' not found!"
  # List directory contents to debug
  ls -la
  
  # Try to check if it's named differently
  if [ -d ".next/out" ]; then
    echo "Found '.next/out' directory"
    # Move it to the correct location
    mv .next/out ./out
  fi
fi

# Make sure Cloudflare Pages can find the output
echo "Final directory structure:"
ls -la