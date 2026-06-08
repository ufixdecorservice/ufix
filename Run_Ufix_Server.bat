@echo off
echo ==============================================
echo  Ufix Decor Service - Local Web Server
echo  Access your website at: http://localhost:8000
echo ==============================================
cd /d "%~dp0"
python -m http.server --bind 0.0.0.0 8000
pause