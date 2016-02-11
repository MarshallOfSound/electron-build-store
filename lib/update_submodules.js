const execSync = require('child_process').execSync;

module.exports = () => {
  console.log('Updating all the submodules to latest version');
  console.log('');

  console.log(execSync('git submodule foreach git pull origin master').toString());
};
