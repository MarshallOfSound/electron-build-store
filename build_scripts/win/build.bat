@echo off
set LIBCHROMIUMCONTENT_COMMIT={{COMMIT}}

cd electron

python script/bootstrap.py -v -u file:///{{PROJECT_PATH}}/libchromiumcontent --target_arch={{ARCH}}

python script/build.py -c R

python script/create-dist.py

@echo on
