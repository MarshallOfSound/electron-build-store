'use strict';

const argv = require('yargs').argv;;
const execSync = require('child_process').execSync;
const fetch = require('node-fetch');
const fs = require('fs');
const mkdirp = require('mkdirp');

const updateModules = require('./lib/update_submodules');
const patchGypi = require('./lib/patch_gypi');
const buildLCC = require('./lib/build_lcc');
const buildElectron = require('./lib/build_electron');
const publishToGitHub = require('./lib/publish');

const platform = {'win32': 'win', 'darwin': 'osx'}[process.platform];
const arch = argv.arch || 'x64';

updateModules(platform);

patchGypi();

mkdirp('./gen_build');

const ELECTRON_CONFIG = fs.readFileSync('./electron/script/lib/config.py', 'utf8');

const ELECTRON_COMMIT = execSync('git submodule status electron').toString().split(' ')[1];
const ELECTRON_TAG = execSync('git submodule status electron').toString().split(' ')[3];
const LIBCHROMIUMCONTENT_COMMIT = execSync('git submodule status libchromiumcontent').toString().split(' ')[1];

global.REQUIRED_COMMIT = ELECTRON_CONFIG.split(/(?:\r\n|\r|\n)/g)[10].match('.+\ =\ \'(.+)\'')[1];

if (REQUIRED_COMMIT !== LIBCHROMIUMCONTENT_COMMIT) {
  console.log("The libchromium commit does not match the required version in electron");
  console.log("Attempting to match commit now");
  console.log("");

  execSync(`cd libchromiumcontent && git checkout ${REQUIRED_COMMIT}`);
  if (execSync('git submodule status libchromiumcontent').toString().split(' ')[1] !== REQUIRED_COMMIT) {
    throw Error("Could not match required libchromiumcontent commit");
  }
}

fetch('https://api.github.com/repos/MarshallOfSound/electron-prebuilt-safe/releases')
  .then((resp) => resp.json())
  .then((releases) => {
    return new Promise((resolve, reject) => {
      let released = false;
      releases.forEach((release) => {
        if (ELECTRON_TAG.split(release.tag_name).length > 1) {
          release.assets.forEach((asset) => {
            if (asset.name === `electron-${release.tag_name}-${process.platform}-${arch}.zip`) {
              released = true;
            }
          });
        }
      });
      if (!released || process.env.IGNORE_RELEASED) {
        resolve();
      } else {
        console.log("This electron version has already been built and released on GitHub");
        process.exit(0);
      }
    });
  })
  .then(buildLCC.bind(this, platform, arch))
  .then(() => {
    console.log('LCC successfully built!!');
    buildElectron(platform, arch)
      .then(publishToGitHub.bind(this, platform, arch))
      .then(() => {
        console.log('');
        console.log('##################');
        console.log('##################');
        console.log('###### DONE ######');
        console.log('##################');
        console.log('##################');
      })
      .catch((err) => {
        console.error('Something went wrong somewhere... (e)');
        console.error(err);
        throw err;
      });
  })
  .catch((err) => {
    console.error('Something went wrong somewhere... (lcc)');
    console.error(err);
    throw err;
  });
