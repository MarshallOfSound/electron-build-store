'use strict';

const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

module.exports = (platform, arch) => {
  return new Promise((resolve, reject) => {
    // console.log('Triggering a local build of libchromiumcontent');
    let shouldRegenerate;

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

    script_content = fs.readFileSync(path.resolve(`${__dirname}/../build_scripts/${platform}/build_lcc${script_ext}`), 'utf8');
    shouldRegenerate = !fs.existsSync(path.resolve(`${__dirname}/./libchromiumcontent/${platform}/${arch}/${REQUIRED_COMMIT}/libchromiumcontent.zip`));

    const new_script_content = script_content
                                  .replace(/\{\{COMMIT\}\}/g, REQUIRED_COMMIT)
                                  .replace(/\{\{PLATFORM\}\}/g, platform)
                                  .replace(/\{\{ARCH\}\}/g, arch);

    fs.writeFileSync(`${__dirname}/../gen_build/build_lcc${script_ext}`, new_script_content);
    fs.chmodSync(`${__dirname}/../gen_build/build_lcc${script_ext}`, '777');

    if (shouldRegenerate) {
      console.log('Need to build libchromiumcontent, starting now');
      const ls = spawn(`${__dirname}/../gen_build/build_lcc${script_ext}`)
      ls.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      ls.stderr.on('data', (data) => {
        console.log(data.toString());
      });

      ls.on('close', (code) => {
        console.log(`Build of "libchromiumcontent" complete with exit code: ${code}`);
        if (code != 0) {
          reject('The build failed somewhere...');
          return;
        }
        console.log('Moving on to electron');
        resolve();
      });
    } else {
      console.log('Local build of libchromiumcontent already exists (yay)');
      console.log('Moving on...');
      resolve();
    }
  });
};
