@echo off
set LIBCHROMIUMCONTENT_COMMIT='ad63d8ba890bcaad2f1b7e6de148b7992f4d3af7'

cd libchromiumcontent

echo "Bootstrapping"
python script/bootstrap

echo "Updating"
python script/update -t ia32

echo "Building"
python script/build -t ia32

echo "Wrapping"
python script/create-dist

mkdir -p win/ia32/$LIBCHROMIUMCONTENT_COMMIT
mv libchromiumcontent* win/ia32/$LIBCHROMIUMCONTENT_COMMIT

@echo on
