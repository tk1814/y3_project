/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
const helpers = require('./helpers');
const path = require('path');
const fs = require('fs');


module.exports = (on, config) => {
  
  require('@cypress/code-coverage/task')(on, config)
  // require('@cypress/react/plugins/react-scripts')(on, config) // ADDED @cypress/react
  // include any other plugin code...

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  
  on('before:browser:launch', async (browser = {}, arguments_) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      console.log('TRUE'); // required by cypress ¯\_(ツ)_/¯
      arguments_.args.push('--window-size=1920,1080');
      return arguments_;
    }

    if (browser.name === 'electron') {
      arguments_['width'] = 1920;
      arguments_['height'] = 1080;
      arguments_['resizable'] = false;
      return arguments_;
    }

    // metamask welcome screen blocks cypress from loading
    if (browser.name === 'chrome') {
      arguments_.args.push('--disable-background-timer-throttling');
      arguments_.args.push('--disable-backgrounding-occluded-windows');
      arguments_.args.push('--disable-renderer-backgrounding');
    }

    // NOTE: extensions cannot be loaded in headless Chrome
    const metamaskPath = await prepareMetamask();
    arguments_.extensions.push(metamaskPath);
    return arguments_;
  });

  return config
}

async function prepareMetamask() {
  const release = await helpers.getMetamaskReleases();
  const downloadsDirectory = path.resolve(__dirname, 'downloads');
  if (!fs.existsSync(downloadsDirectory)) {
    fs.mkdirSync(downloadsDirectory);
  }
  const downloadDestination = path.join(downloadsDirectory, release.filename);
  await helpers.download(release.downloadUrl, downloadDestination);
  const metamaskDirectory = path.join(downloadsDirectory, 'metamask');
  await helpers.extract(downloadDestination, metamaskDirectory);
  return metamaskDirectory;
}
