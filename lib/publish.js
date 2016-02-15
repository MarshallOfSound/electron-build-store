'use strict';

const GitHubAPI = require('github');
const fs = require('fs');
const path = require('path');

const VERSION = require('../electron/package.json').version;

const createRelease = (github) => {
  return new Promise((resolve, reject) => {
    github.releases.createRelease({
      owner: 'MarshallOfSound',
      repo: 'electron-prebuilt-safe',
      tag_name: `v${VERSION}`,
      name: `Electron v${VERSION}`,
      body: `Safe build of Electron release -- ${VERSION}`
    }, (err) => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    })
  });
};

const uploadRelease = (github, platform, arch, releaseID) => {
  return new Promise((resolve, reject) => {
    console.log('Uploading release assets');
    let count = 0;
    const uploadDone = () => {
      count++;
      if (count === 2) {
        console.log('All resources uploaded to GitHub!!');
        resolve();
      }
    }
    github.releases.uploadAsset({
      owner: 'MarshallOfSound',
      repo: 'electron-prebuilt-safe',
      id: releaseID,
      name: `electron-v${VERSION}-${process.platform}-${arch}.zip`,
      filePath: path.resolve(`${__dirname}/../electron/dist/electron-v${VERSION}-${process.platform}-${arch}.zip`)
    }, uploadDone);
    github.releases.uploadAsset({
      owner: 'MarshallOfSound',
      repo: 'electron-prebuilt-safe',
      id: releaseID,
      name: `electron-v${VERSION}-${process.platform}-${arch}-symbols.zip`,
      filePath: path.resolve(`${__dirname}/../electron/dist/electron-v${VERSION}-${process.platform}-${arch}-symbols.zip`)
    }, uploadDone);
  });
};

module.exports = (platform, arch) => {
  return new Promise((resolve, reject) => {
    const github = new GitHubAPI({
      version: '3.0.0',
      headers: {
        'user-agent': 'Electron Prebuilt Safe Publish Bot'
      }
    });

    if (!process.env.GITHUB_API_TOKEN) {
      console.error('');
      console.error('###############################################################################');
      console.error('Warning: GitHub API token not set, we can\'t publish to the releases section...');
      console.error('###############################################################################');
      console.error('');
      return;
    }

    github.authenticate({
      type: 'oauth',
      token: process.env.GITHUB_API_TOKEN,
    });

    github.releases.listReleases({
      owner: 'MarshallOfSound',
      repo: 'electron-prebuilt-safe'
    }, (err, data) => {
      let foundAsset = false;
      let foundRelease = false;
      let foundReleaseID;
      if (err) return;
      data.forEach((release) => {
        if (release.tag_name === 'v' + VERSION) {
          foundRelease = true;
          foundReleaseID = release.id;
          release.assets.forEach((asset) => {
            if (asset.name === `electron-v${VERSION}-${process.platform}-${arch}.zip`) {
              foundAsset = true;
            }
          });
        }
      });
      if (!foundRelease) {
        console.log('Creating release');
        createRelease(github)
          .then(module.exports.bind(this, platform, arch))
          .then(resolve);
          return;
      }
      if (foundAsset) {
        console.log('Aready uploaded');
        resolve();
      } else {
        if (fs.existsSync(path.resolve(`${__dirname}/../electron/dist/electron-v${VERSION}-${process.platform}-${arch}.zip`))) {
          uploadRelease(github, platform, arch, foundReleaseID)
            .then(resolve);
        } else {
          console.log('Electron has not been built, expected to find a zip file at: ');
          console.log(path.resolve(`${__dirname}/../electron/dist/electron-v${VERSION}-${process.platform}-${arch}.zip`));
          reject('Electron zip not found');
        }
      }
    });
  });
};
