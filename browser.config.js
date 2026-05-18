'use strict';
const args = process.argv.slice(2);
const marketplaceArgIdx = args.indexOf('--marketplace');
const MARKETPLACE_PATH = marketplaceArgIdx !== -1 && args[marketplaceArgIdx + 1]
  ? args[marketplaceArgIdx + 1]
  : process.env.MARKETPLACE_PATH || './example';

module.exports = { MARKETPLACE_PATH };
