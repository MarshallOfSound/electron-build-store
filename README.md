# How the hell does this work?

> Good question, we'll get to that

## Building

All platforms require Python `2.7.10` to be available on the path.

### Windows

Requires Visual Studio to be installed

**NOTE:** So far it is known to work with only Visual Studio 2013

Set the following environment variables

```bash
GYP_MSVS_OVERRIDE_PATH = 'C:\path\to\visual\studio'
GYP_MSVS_VERSION = 'year of visual studio install E.g. 2015'
```

Run the following

```
node index.js
```

#### Windows Path Length Issues
It appears as though on windows you HAVE to clone this repository into the root of a drive otherwise the file path gets too long for the OS to handle

### Mac

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
