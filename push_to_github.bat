@echo off
echo Initializing git repository...
git init

echo Adding all files...
git add .

echo Creating initial commit...
git commit -m "Initial commit - HRMS application"

echo Adding remote repository...
git remote add origin https://github.com/purveshpatil41/dayflow-hrms.git

echo Setting main branch...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

echo Git operations completed!
pause