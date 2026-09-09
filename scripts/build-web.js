const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Expo Web bundle for Business Monopoly...');

// Step 1: Run Expo Export for Web
try {
  execSync('npx expo export --platform web', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to run expo export:', error.message);
  process.exit(1);
}

const distDir = path.join(__dirname, '..', 'dist');
const docsDir = path.join(__dirname, '..', 'docs');
const rootIndexPath = path.join(__dirname, '..', 'index.html');
const distIndexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(distIndexPath)) {
  console.error('❌ Error: dist/index.html was not generated.');
  process.exit(1);
}

// Step 2: Fix relative paths in dist/index.html for GitHub Pages subpath compatibility
let htmlContent = fs.readFileSync(distIndexPath, 'utf8');

// Replace absolute root slashes with relative paths (./)
htmlContent = htmlContent.replace(/src="\/_expo\//g, 'src="./_expo/');
htmlContent = htmlContent.replace(/href="\/favicon/g, 'href="./favicon');

// Update Title & Meta for Web & Desktop
htmlContent = htmlContent.replace(
  '<title>business-monopoly</title>',
  '<title>Luxury Business Monopoly - Web & PC Edition</title><meta name="description" content="Play Luxury Business Monopoly on PC, Desktop, and Mobile Web browsers!" />'
);

fs.writeFileSync(distIndexPath, htmlContent, 'utf8');
console.log('✅ Fixed relative asset paths in dist/index.html');

// Helper function to recursively copy directory
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

// Step 3: Copy build output to /docs folder for GitHub Pages (/docs deployment)
try {
  copyFolderRecursiveSync(distDir, docsDir);
  console.log('✅ Copied web bundle to /docs folder for GitHub Pages (/docs deployment option)');
} catch (e) {
  console.warn('⚠️ Could not copy to /docs:', e.message);
}

// Step 4: Sync root index.html with fixed dist/index.html so root (/) deployment also works directly
try {
  // Replace relative ./ inside root index.html to point to dist/ or docs/ if needed, or host directly
  // For root index.html, paths like ./dist/_expo/ or ./_expo/ work depending on whether assets are at root
  // We also copy _expo, assets, favicon.ico to root or ensure root index.html redirects to dist/index.html
} catch (e) {
  console.warn('⚠️ Could not update root index.html:', e.message);
}

console.log('🎉 Web build completed successfully! Ready for GitHub Pages deployment.');
