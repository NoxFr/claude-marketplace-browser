'use strict';

const { escapeHtml, layout } = require('./layout');
const { renderListPage } = require('./page-list');
const { renderDetailPage } = require('./page-detail');

module.exports = { escapeHtml, layout, renderListPage, renderDetailPage };
