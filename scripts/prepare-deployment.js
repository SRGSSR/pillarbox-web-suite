import fs from 'fs';
import path from 'path';

const packagesDir = path.join(process.cwd(), 'packages');
const deploymentDir = path.join(process.cwd(), 'dist');

// Ensure the deployment directory exists
if (!fs.existsSync(deploymentDir)) {
  fs.mkdirSync(deploymentDir, { recursive: true });
}

// Read all package directories
const packages = fs.readdirSync(packagesDir);
const indexContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Package Index</title>
    <style>
        body { font-family: Arial, sans-serif; }
        ul { list-style-type: none; padding: 0; }
        li { margin: 10px 0; }
        a { text-decoration: none; color: blue; }
    </style>
</head>
<body>
    <h1>Available Packages</h1>
    <ul>
    ${packages.map(packageName => {
        const distDir = path.join(packagesDir, packageName, 'dist');
        const targetDir = path.join(deploymentDir, packageName);
    
        // Copy if the dist directory exists
        if (fs.existsSync(distDir)) {
          fs.cpSync(distDir, targetDir, { recursive: true });
    
          return `<li><a href="${packageName}/index.html">${packageName}</a></li>`;
        }
    })}
    </ul>
</body>
</html>
`;

// Write the index.html to the deployment directory
fs.writeFileSync(path.join(deploymentDir, 'index.html'), indexContent);
