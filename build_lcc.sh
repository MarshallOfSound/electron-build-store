LIBCHROMIUMCONTENT_COMMIT='ad63d8ba890bcaad2f1b7e6de148b7992f4d3af7'

cd libchromiumcontent
./script/bootstrap
./script/update
./script/build
./script/create-dist

mkdir -p osx/x64/$LIBCHROMIUMCONTENT_COMMIT
mv libchromiumcontent* osx/x64/$LIBCHROMIUMCONTENT_COMMIT
