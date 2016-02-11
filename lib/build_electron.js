'use strict';

const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

module.exports = (platform, arch) => {
  return new Promise((resolve, reject) => {
    let script_ext;
    let script_content;

    switch (platform) {
      case 'win':
        script_ext = '.bat';
        break;
      case 'osx':
        script_ext = '.sh';
        break;
    }
    if (!script_ext) {
      reject(`You passed an inavlid platform: ${platform}`);
      return;
    }

    script_content = fs.readFileSync(path.resolve(`${__dirname}/../build_scripts/${platform}/build${script_ext}`), 'utf8');

    const new_script_content = script_content
                                  .replace(/\{\{PROJECT_PATH\}\}/g, path.resolve(`${__dirname}/..`))
                                  .replace(/\{\{COMMIT\}\}/g, REQUIRED_COMMIT)
                                  .replace(/\{\{PLATFORM\}\}/g, platform)
                                  .replace(/\{\{ARCH\}\}/g, arch);

    fs.writeFileSync(`${__dirname}/../gen_build/build${script_ext}`, new_script_content);
    fs.chmodSync(`${__dirname}/../gen_build/build${script_ext}`, '777');

    console.log('Need to build electron, starting now');
    const ls = spawn(`${__dirname}/../gen_build/build${script_ext}`)
    ls.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    ls.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });

    ls.on('close', (code) => {
      console.log(`Build of "electron" complete with exit code: ${code}`);
      if (code != 0) {
        reject('The build failed somewhere...');
        return;
      }
      resolve();
    });
  });
};
