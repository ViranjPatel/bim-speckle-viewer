@echo off
REM BIM Speckle Viewer Setup Script for Windows
echo 🚀 Setting up BIM Speckle Viewer...
echo.

REM Create necessary directories
echo 📁 Creating directories...
if not exist \"uploads\" mkdir uploads
if not exist \"uploads\\models\" mkdir uploads\\models
if not exist \"uploads\\metadata\" mkdir uploads\\metadata
if not exist \"logs\" mkdir logs

REM Install server dependencies
echo 📦 Installing server dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

REM Copy environment file if it doesn't exist
if not exist \".env\" (
    echo ⚙️ Creating environment file...
    copy \".env.example\" \".env\"
    echo ✅ Environment file created. Please update .env with your configuration.
)

echo.
echo ✨ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Update .env file with your configuration
echo 2. Run 'npm run dev' to start development servers
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📚 For more information, see README.md
echo.
pause