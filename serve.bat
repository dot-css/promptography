@echo off
echo Starting Promptography Development Server...
echo.

REM Check if Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Node.js serve...
    npx serve . -p 8000
    goto :end
)

REM Check if Python is available
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Python HTTP server...
    python -m http.server 8000
    goto :end
)

REM Check if PHP is available
where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using PHP development server...
    php -S localhost:8000
    goto :end
)

echo No suitable server found. Please install one of the following:
echo - Node.js (recommended): https://nodejs.org/
echo - Python: https://python.org/
echo - PHP: https://php.net/
echo.
echo Then run this script again or manually serve the files.
pause

:end
