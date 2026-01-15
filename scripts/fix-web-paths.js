#!/usr/bin/env node

/**
 * Post-build script to fix absolute paths in index.html for GitHub Pages deployment
 * Converts absolute paths (/) to relative paths (./) for proper subdirectory support
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../web-build/index.html');

try {
  let content = fs.readFileSync(indexPath, 'utf8');

  // Replace absolute paths with relative paths
  content = content.replace(/href="\/([^"]+)"/g, 'href="./$1"');
  content = content.replace(/src="\/([^"]+)"/g, 'src="./$1"');

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('✓ Fixed paths in index.html for GitHub Pages');
} catch (error) {
  console.error('Error fixing paths:', error.message);
  process.exit(1);
}
