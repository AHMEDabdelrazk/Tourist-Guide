@echo off
echo ========================================================
echo   GlobalGuide - Starting Full-Stack Application
echo ========================================================
echo.
echo [1/2] Starting ASP.NET Core Web API on http://localhost:5000 ...
start "GlobalGuide Backend API" cmd /k "dotnet run --project TouristGuide.API --urls=http://localhost:5000"

echo [2/2] Starting React Frontend on http://localhost:5173 ...
cd TouristGuide.React
start "GlobalGuide React Frontend" cmd /k "npm run dev"

echo.
echo ========================================================
echo   Applications Launched!
echo   - Frontend: http://localhost:5173
echo   - Backend API: http://localhost:5000
echo   - Swagger Docs: http://localhost:5000/swagger
echo ========================================================
