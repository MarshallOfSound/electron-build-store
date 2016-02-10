@echo off
set LIBCHROMIUMCONTENT_COMMIT=ad63d8ba890bcaad2f1b7e6de148b7992f4d3af7

cd libchromiumcontent

echo "Bootstrapping"
python script/bootstrap

echo "Updating"
python script/update --target_arch ia32

echo "Building"
python script/build --target_arch ia32

echo "Wrapping"
python script/create-dist --target_arch ia32

mkdir -p win\ia32\%LIBCHROMIUMCONTENT_COMMIT%
move libchromiumcontent* win\ia32\%LIBCHROMIUMCONTENT_COMMIT%

@echo on
