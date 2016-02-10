# How the hell does this work?

> Good question, we'll get to that
> TLDR: Gypsy magic

## Using

Using this prebuilt is actually insanely easy, you can use this prebuilt with either `electron-packager` or `electron-prebuilt` by simply setting an environment variable on your machine.

```bash
ELECTRON_MIRROR='https://github.com/MarshallOfSound/electron-prebuilt-safe/releases/download/v'
```

### Switching from the standard `prebuilt` to this

If you have already downloaded versions of electron before using this prebuilt you might have to delete everything in your `~/.electron` directory (`C:\Users\<username>\.electron` on windows).  You can do this either in a file explorer or with
```bash
rm -rf ~/.electron
```

You will then have to uninstall `electron-prebuilt` from any project you use it in and reinstall it in order for it to fetch the new prebuilts.

```bash
cd /your/project/directory
rm -rf node_modules/electron-prebuilt
npm i
```

## Building

All platforms require Python `2.7.10` to be available on the path.

### Windows

#### Pre-reqs
* Windows 7 / Server 2008 R2 or higher
* VS 2013 with Update 4
* Node.js
* Git

#### Running
Set the following environment variables

```bash
GYP_MSVS_OVERRIDE_PATH = 'C:\path\to\visual\studio'
GYP_MSVS_VERSION = 'year of visual studio install E.g. 2013'
```

Run the following

```
node index.js
```

#### Windows Path Length Issues
It appears as though on windows you HAVE to clone this repository into the root of a drive otherwise the file path gets too long for the OS to handle

### Mac

#### Pre-reqs
* OSX >= 10.8
* Xcode >= 5.1 BUT < 7
* Node.js

*If your python came from homebrew then you might need this python module*
* pyobjc

#### Running
Update the path in `build.sh` to point to the directory this project was cloned into

Run the following

```
node index.js
```

## TODO

* Automatically apply patch to `chromiumcontent.gypi` instead of doing it manually
* Automatically detect the required `LIBCHROMIUMCONTENT_COMMIT` variable so it doesn't have to be manually set
* Make a build path in `index.js` to handle `x64` builds, currently we support it but the default is `ia32`
* Support linux builds, currently only support OSX and Windows
