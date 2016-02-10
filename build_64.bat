@echo off
set LIBCHROMIUMCONTENT_COMMIT='ad63d8ba890bcaad2f1b7e6de148b7992f4d3af7'

cd electron

python script/bootstrap.py -v -u file:///C:/electron-prebuilt-noffmpeg/libchromiumcontent --target_arch=x64
python script/build.py -c R
python script/create-dist.py
@echo on
