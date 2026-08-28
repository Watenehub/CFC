@echo off
echo Starting Cornerstone Family Chapel Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python run.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://127.0.0.1:5000
echo Frontend: http://localhost:3000
echo.
