cd electron

./script/bootstrap.py -v -u file:///Users/<username>/projects/electron-prebuilt-safe/libchromiumcontent
./script/build.py
./script/create-dist.py
