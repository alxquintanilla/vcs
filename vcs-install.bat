#Make directory
mkdir %USERPROFILE%\.vcs

#Set Environment variable
set PATH=%PATH%;%USERPROFILE%\.vcs

#Move files to .vcs
xcopy /i /s *.* %USERPROFILE%\.vcs
