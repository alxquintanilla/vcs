@echo off

setlocal ENABLEDELAYEDEXPANSION

set args=

for %%I IN (%*) DO (
  set args=!args! "%%I"
)


node %USERPROFILE%\.vcs\client.js !args!
