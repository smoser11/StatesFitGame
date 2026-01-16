#!/usr/bin/env node

/**
 * Post-build script to fix paths in index.html for GitHub Pages deployment
 * Removes the /StatesFitGame prefix since GitHub Pages already serves from that subdirectory
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../web-build/index.html');

try {
  let content = fs.readFileSync(indexPath, 'utf8');

  // Remove /StatesFitGame/ from all paths since GitHub Pages already serves from /StatesFitGame/
  content = content.replace(/href="\.\/StatesFitGame\//g, 'href="./');
  content = content.replace(/src="\.\/StatesFitGame\//g, 'src="./');
  content = content.replace(/="\.\/StatesFitGame\//g, '="./');

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('✓ Fixed paths in index.html for GitHub Pages');
} catch (error) {
  console.error('Error fixing paths:', error.message);
  process.exit(1);
}
