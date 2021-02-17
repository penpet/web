/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const plugins = [[require('next-optimized-images')]]
const config = { distDir: 'client-build' }

module.exports = require('next-compose-plugins')(plugins, config)
