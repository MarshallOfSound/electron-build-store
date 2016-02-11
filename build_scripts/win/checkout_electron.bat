@echo off

cd ..\..\electron

FOR /F "tokens=* USEBACKQ" %%F IN (`git rev-list --tags --max-count=1`) DO (
SET commit=%%F
)

git checkout %commit%

cd ..

@echo on
