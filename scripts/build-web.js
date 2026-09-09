const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Expo Web bundle for GitHub Pages deployment...');

const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const docsDir = path.join(projectRoot, 'docs');
const distIndexPath = path.join(distDir, 'index.html');

// Step 1: Run Expo Export for Web
try {
  execSync('npx expo export --platform web', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to run expo export:', error.message);
  process.exit(1);
}

if (!fs.existsSync(distIndexPath)) {
  console.error('❌ Error: dist/index.html was not generated.');
  process.exit(1);
}

// Step 2: Fix relative paths in dist/index.html for GitHub Pages subpath compatibility
let htmlContent = fs.readFileSync(distIndexPath, 'utf8');

// Replace absolute root slashes with relative paths (./)
htmlContent = htmlContent.replace(/src="\/_expo\//g, 'src="./_expo/');
htmlContent = htmlContent.replace(/href="\/favicon/g, 'href="./favicon');

// Update Title & Meta
htmlContent = htmlContent.replace(
  '<title>business-monopoly</title>',
  '<title>Luxury Business Monopoly - Web & PC Edition</title><meta name="description" content="Play Luxury Business Monopoly on PC, Desktop, and Mobile Web browsers!" />'
);

fs.writeFileSync(distIndexPath, htmlContent, 'utf8');
console.log('✅ Fixed relative asset paths in dist/index.html');

// Recursive folder copy helper
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  });
}

// Step 3: Copy build output to /docs directory for GitHub Pages (/docs option)
try {
  copyFolderRecursiveSync(distDir, docsDir);
  console.log('✅ Copied web bundle to /docs folder');
} catch (e) {
  console.warn('⚠️ Could not copy to /docs:', e.message);
}

// Step 4: Copy _expo folder to root directory so root (/) deployment option also works directly
const rootExpoDir = path.join(projectRoot, '_expo');
const distExpoDir = path.join(distDir, '_expo');
if (fs.existsSync(distExpoDir)) {
  try {
    copyFolderRecursiveSync(distExpoDir, rootExpoDir);
    console.log('✅ Copied _expo folder to project root');
  } catch (e) {
    console.warn('⚠️ Could not copy _expo to root:', e.message);
  }
}

// Step 5: Update root index.html to serve the web bundle directly (No iframe dependency)
const rootIndexPath = path.join(projectRoot, 'index.html');
fs.writeFileSync(rootIndexPath, htmlContent, 'utf8');
console.log('✅ Updated root index.html to serve web app directly');

// Step 6: Create .nojekyll files in project root, /docs, and /dist
// (CRITICAL: Disables GitHub Pages Jekyll build so _expo directory and JS bundles are NOT ignored by GitHub Pages!)
const noJekyllContent = '';
fs.writeFileSync(path.join(projectRoot, '.nojekyll'), noJekyllContent, 'utf8');
fs.writeFileSync(path.join(docsDir, '.nojekyll'), noJekyllContent, 'utf8');
fs.writeFileSync(path.join(distDir, '.nojekyll'), noJekyllContent, 'utf8');
console.log('✅ Created .nojekyll files in root, /docs, and /dist (Fixes 404 on _expo JS bundles)');

console.log('🎉 Web build completed successfully! 100% ready for GitHub Pages deployment.');
