'use strict';

const { escapeHtml, layout } = require('./layout');
const { renderGrid, renderListPage } = require('./page-list');
const { renderDetailPage } = require('./page-detail');

module.exports = { escapeHtml, layout, renderGrid, renderListPage, renderDetailPage };
