#!/bin/bash
# Use the local Node.js installation
export PATH=/home/ritlab-01/.gemini/node/bin:$PATH

# Check if node works
node --version

# Install dependencies if needed (just to be safe)
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the dev server
echo "Starting frontend..."
npm run dev
