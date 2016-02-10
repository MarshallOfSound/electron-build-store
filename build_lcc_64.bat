@echo off
set LIBCHROMIUMCONTENT_COMMIT='ad63d8ba890bcaad2f1b7e6de148b7992f4d3af7'

cd libchromiumcontent

echo "Bootstrapping"
python script/bootstrap

echo "Updating"
python script/update -t x64

echo "Building"
python script/build -t x64

echo "Wrapping"
python script/create-dist

mkdir -p win/x64/$LIBCHROMIUMCONTENT_COMMIT
mv libchromiumcontent* win/x64/$LIBCHROMIUMCONTENT_COMMIT

@echo on
