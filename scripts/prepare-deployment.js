import fs from 'fs';
import path from 'path';

const packagesDir = path.join(process.cwd(), 'plugins');
const deploymentDir = path.join(process.cwd(), 'dist');

// Ensure the deployment directory exists
if (!fs.existsSync(deploymentDir)) {
  fs.mkdirSync(deploymentDir, { recursive: true });
}

// Read all package directories
const plugins = fs.readdirSync(packagesDir);
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
    <h1>Available Plugins</h1>
    <ul>
    ${plugins.map(plugin => {
        const distDir = path.join(packagesDir, plugin, 'dist');
        const targetDir = path.join(deploymentDir, plugin);
    
        // Copy if the dist directory exists
        if (fs.existsSync(distDir)) {
          fs.cpSync(distDir, targetDir, { recursive: true });
    
          return `<li><a href="${plugin}/index.html">${plugin}</a></li>`;
        }
    })}
    </ul>
</body>
</html>
`;

// Write the index.html to the deployment directory
fs.writeFileSync(path.join(deploymentDir, 'index.html'), indexContent);
