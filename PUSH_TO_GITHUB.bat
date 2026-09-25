@echo off
title Push Portfolio Code to GitHub
color 0A
echo ====================================================================
echo   DANG PUSH CODE LEN GITHUB: mbxhoan/portfolio-phatpham (main)
echo ====================================================================
echo.
cd /d "%~dp0"
"C:\Users\Phat\AppData\Local\Temp\mingit\cmd\git.exe" push -u origin main
echo.
echo ====================================================================
echo   HOAN TAT PUSH CODE! VERCEL SE TU DONG DEPLOY LEN PRODUCTION.
echo ====================================================================
pause
