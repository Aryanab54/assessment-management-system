#!/bin/bash

echo "🚀 Starting Assessment Management System..."

# Start backend
echo "📡 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "🌐 Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "✅ System started successfully!"
echo "📡 Backend running on: http://localhost:9000"
echo "🌐 Frontend running on: http://localhost:3000"
echo ""
echo "🔧 API Endpoints:"
echo "   - Health Check: http://localhost:9000/api/health"
echo "   - Register: POST http://localhost:9000/api/auth/register"
echo "   - Login: POST http://localhost:9000/api/auth/login"
echo "   - Generate Report: POST http://localhost:9000/api/reports/generate-report"
echo ""
echo "📊 Sample Session IDs for testing:"
echo "   - session_001 (Health & Fitness Assessment)"
echo "   - session_002 (Cardiac Assessment)"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID