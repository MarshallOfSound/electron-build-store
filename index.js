'use strict';

const execSync = require('child_process').execSync;
const fs = require('fs');
const spawn = require('child_process').spawn;
const GitHubApi = require('github');

console.log('Updating all the submodules to latest version');
console.log('');

console.log(execSync('git submodule foreach git pull origin master').toString());

const GYPI = fs.readFileSync('./libchromiumcontent/chromiumcontent/chromiumcontent.gypi', 'utf8');
const ELECTRON_CONFIG = fs.readFileSync('./electron/script/lib/config.py', 'utf8');


const ELECTRON_COMMIT = execSync('git submodule status electron').toString().split(' ')[1];
const LIBCHROMIUMCONTENT_COMMIT = execSync('git submodule status libchromiumcontent').toString().split(' ')[1];

const REQUIRED_COMMIT = ELECTRON_CONFIG.split(/(?:\r\n|\r|\n)/g)[10].match('.+\ =\ \'(.+)\'')[1];

if (REQUIRED_COMMIT !== LIBCHROMIUMCONTENT_COMMIT) {
  throw Error("The libchromium commit does not match the required version in electron");
}

let ls;
const next = () => {
  if (process.platform === 'win32') {
    ls = spawn('build.bat', []);
  } else {
    ls = spawn('build.sh', []);
  }

  ls.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  ls.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  ls.on('close', (code) => {
    console.log('Build of electron complete');
  });
};

console.log('Triggering a local build of libchromiumcontent');
let gen;
if (process.platform === 'win32') {
  ls = spawn('build_lcc.bat', []);
  gen = !fs.existsSync(`./libchromiumcontent/win/ia32/${REQUIRED_COMMIT}/libchromiumcontent.zip`);
} else {
  ls = spawn('build_lcc.sh', []);
  gen = !fs.existsSync(`./libchromiumcontent/osx/x64/${REQUIRED_COMMIT}/libchromiumcontent.zip`);
}

if (gen) {
  ls.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  ls.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  ls.on('close', (code) => {
    console.log(`Build of "libchromiumcontent" complete with exit code: ${code}`);
    console.log('Moving on to electron');
    next();
  });
} else {
  console.log('Local build of libchromiumcontent already exists (yay)');
  console.log('Moving on to electron');
  next();
}
