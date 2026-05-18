'use strict';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/styles.css">
  <script src="https://unpkg.com/htmx.org@1.9.10/dist/htmx.min.js" onerror="this.onerror=null;this.src='/vendor/htmx.min.js'"></script>
</head>
<body hx-boost="true">
  <header>
    <h1>Claude Marketplace Browser</h1>
    <p>Explorez et découvrez les plugins disponibles</p>
  </header>
  <main>
    ${body}
  </main>
  <footer>Made with ❤️ by Mathieu Durand</footer>
</body>
</html>`;
}

module.exports = { escapeHtml, layout };
