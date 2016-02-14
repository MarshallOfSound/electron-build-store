'use strict';

const execSync = require('child_process').execSync;

module.exports = (platform) => {
  console.log('Updating all the submodules to latest version');
  console.log('');

  console.log(execSync('git submodule foreach git fetch origin master').toString());

  let script_ext;

  switch (platform) {
    case 'win':
      script_ext = '.bat';
      break;
    case 'osx':
      script_ext = '.sh';
      break;
  }

  console.log(execSync(`build_scripts/${platform}/checkout_electron${script_ext}`).toString() || '');
};
