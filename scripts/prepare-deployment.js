import fs from 'fs';
import path from 'path';

// ANSI escape codes for colors and styles
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

// Define the directories
const packagesDir = path.join(process.cwd(), 'packages');
const deploymentDir = path.join(process.cwd(), 'dist');

// Ensure the deployment directory exists
if (!fs.existsSync(deploymentDir)) {
  fs.mkdirSync(deploymentDir, { recursive: true });
  console.log(`${colors.blue}Created deployment directory at ${deploymentDir}${colors.reset}`);
}

// Read all package directories
fs.readdirSync(packagesDir).forEach(packageName => {
  // Define the source and target directories for the current package
  const distDir = path.join(packagesDir, packageName, 'dist/demo');
  const targetDir = path.join(deploymentDir, 'packages', packageName);

  // Check if the package's dist directory exists
  if (!fs.existsSync(distDir)) {
    console.log(`${colors.yellow}(!) No dist directory found for package: ${packageName}${colors.reset}`);

    return;
  }

  // Copy the package dist directory to the target location
  fs.cpSync(distDir, targetDir, { recursive: true });
  const relativeDistDir = path.relative(process.cwd(), distDir);
  const relativeTargetDir = path.relative(process.cwd(), targetDir);

  console.log(`${colors.green}✓${colors.reset} ${colors.bold}Copied ${relativeDistDir} to ${relativeTargetDir}${colors.reset}`);
});
