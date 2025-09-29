@echo off
setlocal

for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%b
echo Current branch: %BRANCH%

if "%BRANCH%"=="main" (
    copy /Y .gitignore.main .gitignore
    echo Switched to .gitignore.main
) else if "%BRANCH%"=="dev" (
    copy /Y .gitignore.dev .gitignore
    echo Switched to .gitignore.dev

endlocal
