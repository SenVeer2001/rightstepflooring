#!/bin/bash

# FSM Pro Development Server Startup Script

echo "🚀 Starting FSM Pro Admin Panel..."
echo ""
echo "📝 Login Credentials:"
echo "   Email: admin@fsm.com"
echo "   Password: demo123"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install --legacy-peer-deps
fi

echo "🔧 Starting Vite development server..."
npm run dev

echo ""
echo "✅ Server ready!"
echo "🌐 Open: http://localhost:5173"
