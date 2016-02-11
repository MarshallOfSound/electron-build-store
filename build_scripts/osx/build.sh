cd electron

./script/bootstrap.py -v -u file://{{PROJECT_PATH}}/libchromiumcontent
./script/build.py
./script/create-dist.py
