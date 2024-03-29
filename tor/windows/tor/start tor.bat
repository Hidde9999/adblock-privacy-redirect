@echo off
setlocal

rem Set the destination directory where torrc needs to be copied
set "destination=%APPDATA%\tor\"

rem Check if the torrc file exists in the current directory
if exist "torrc" (
    rem Copy torrc to the destination directory
    copy "torrc" "%destination%"
    echo torrc copied successfully.
) else (
    echo torrc file not found in the current directory.
)

pause
