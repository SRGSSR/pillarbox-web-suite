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
    <title>Package Showcase</title>
    <link rel="stylesheet" href="https://unpkg.com/open-props">
    <style>
         body {
            font-family: var(--font-sans);
            background-color: var(--gray-9); /* Dark background for body */
            color: var(--gray-1); /* Light text color */
            margin: 0 auto;
            padding: var(--size-3);
            max-width: var(--size-sm);
        }
        header {
            color: var(--gray-3); /* Lightest text color */
            padding-bottom: var(--size-2);
            text-align: center;
            font-size: var(--font-size-1); /* Larger text for the header */
            margin: var(--size-2) auto;
        }
        ul {
            list-style-type: none;
            padding: 0;
            margin: var(--size-2) auto;
            background-color: var(--gray-8); /* Slightly lighter dark background for contrast */
            box-shadow: var(--shadow-3); /* Prominent shadow for 3D effect */
            border-radius: var(--radius-2);
        }
        li {
            border-bottom: 1px solid var(--gray-7);
            margin: 0;
            transition: background-color 0.3s;
        }
        li:first-child {
            border-radius: var(--radius-2) var(--radius-2) 0 0;
        }
        li:last-child {
            border-radius: 0 0 var(--radius-2) var(--radius-2);
        }
        li:only-child {
            border-radius: var(--radius-2);
        }
        li:hover {
            background-color: var(--gray-6); /* Slightly lighter on hover for interactive feel */
        }
        a {
            display: block;
            padding: var(--size-3) var(--size-4);
            text-decoration: none;
            color: var(--gray-4); /* Subtle blue color for links */
            transition: color 0.3s;
            font-size: var(--font-size-2); /* Standard text size for links */
        }
        a:hover {
            color: var(--gray-12); /* Slightly brighter blue on hover */
        }
    </style>
</head>
<body>
    <header>
        <h1>Pillarbox Extensions</h1>
    </header>
    <ul>
        ${packages.map(packageName => {
          const distDir = path.join(packagesDir, packageName, 'dist');
          const targetDir = path.join(deploymentDir, packageName);

          if (!fs.existsSync(distDir)) return;

          fs.cpSync(distDir, targetDir, { recursive: true });

          return `<li><a href="${packageName}/index.html">${packageName}</a></li>`;
        }).filter(Boolean).join('')}
    </ul>
</body>
</html>
`;

// Write the index.html to the deployment directory
fs.writeFileSync(path.join(deploymentDir, 'index.html'), indexContent);
