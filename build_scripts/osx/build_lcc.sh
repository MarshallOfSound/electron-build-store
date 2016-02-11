LIBCHROMIUMCONTENT_COMMIT='{{COMMIT}}'

cd libchromiumcontent
./script/bootstrap
./script/update
./script/build
./script/create-dist

mkdir -p {{PLATFORM}}/{{ARCH}}/$LIBCHROMIUMCONTENT_COMMIT
mv libchromiumcontent* {{PLATFORM}}/{{ARCH}}/$LIBCHROMIUMCONTENT_COMMIT
