#!/bin/bash
echo "🛠 Building Vite project..."
export NODE_ENV=production
npm install
npm run build

echo "🐳 Building Docker image..."
docker-compose build

echo "🚀 Starting container..."
docker-compose up -d

echo "✅ Deployed at: http://localhost/hot-money-dashboard/"
