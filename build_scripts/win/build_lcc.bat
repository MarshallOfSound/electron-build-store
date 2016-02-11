@echo off
set LIBCHROMIUMCONTENT_COMMIT={{COMMIT}}

cd libchromiumcontent

echo "Bootstrapping"
python script/bootstrap

echo "Updating"
python script/update --target_arch {{ARCH}}

echo "Building"
python script/build --target_arch {{ARCH}}

echo "Wrapping"
python script/create-dist --target_arch {{ARCH}}

mkdir win\{{ARCH}}\%LIBCHROMIUMCONTENT_COMMIT%
move libchromiumcontent* win\{{ARCH}}\%LIBCHROMIUMCONTENT_COMMIT%

@echo on
