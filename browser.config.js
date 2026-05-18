'use strict';
const args = process.argv.slice(2);

const marketplaceArgIdx = args.indexOf('--marketplace-path');
const MARKETPLACE_PATH = marketplaceArgIdx !== -1 && args[marketplaceArgIdx + 1]
  ? args[marketplaceArgIdx + 1]
  : process.env.MARKETPLACE_PATH || './example';

const marketplaceUrlArgIdx = args.indexOf('--marketplace-url');
const MARKETPLACE_URL = marketplaceUrlArgIdx !== -1 && args[marketplaceUrlArgIdx + 1]
  ? args[marketplaceUrlArgIdx + 1]
  : process.env.MARKETPLACE_URL || null;

module.exports = { MARKETPLACE_PATH, MARKETPLACE_URL };
