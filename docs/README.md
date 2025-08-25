# Pillarbox Web Suite

![Pillarbox logo](README-images/logo.jpg)

This repository is a comprehensive suite of plugins, themes, and components designed to boost the
experience of the [pillarbox-web](https://github.com/SRGSSR/pillarbox-web) player.

These tools provide versatile options for customization and enhancement tailored to meet your needs.

## Requirements

To use the components in this suite, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this suite, clone this repository:

```shell
git clone https://github.com/SRGSSR/pillarbox-web-suite.git
```

Install the dependencies:

```shell
npm install
```

Start the server:

```shell
npm run start
```

### Adding a new element

Open your terminal and execute the following command:

```bash
npm run create
```

After running the command, you will be prompted to enter the type and name of your element. A new
element directory will be generated in the monorepo with the following structure:

```
/packages/<your-element-name>
|-- src
|   |-- lang                        # Folder containing localization files (only if selected)
|   `-- <your-element-name>.js      # Main JavaScript file for the element
|-- test
|   `-- <your-element-name>.test.js # A default vitest test for your element
|-- .babelrc                        # Babel configuration specific to this element
|-- index.html                      # Demo page to showcase the element
|-- package.json                    # NPM package file, you might need to install additional dependencies
|-- README.md                       # Documentation file for the element
|-- vite.config.lib.js              # Vite configuration for building the element as a library
`-- vite.config.js                  # Vite configuration for building the element demo page
```

After the structure is generated, navigate into the element's directory:

```bash
cd packages/your-element-name
```

The README.md file included in your element's directory provides detailed instructions on building
and testing the element.

## Contributing

Contributions are welcome! The Pillarbox web suite is a common effort maintained collaboratively —
no single team owns the entire suite. This repository focuses exclusively on components
related to video.js and Pillarbox.

If you'd like to contribute, please follow the project's code style and linting rules. Here are some
commands to help you get started:

Check your JavaScript code:

```shell
npm run eslint
```

Check your CSS and SCSS code:

```shell
npm run stylelint
```

Fix your CSS and SCSS code:

```shell
npm run stylelint:fix
```

This project utilizes a pre-commit hook that automatically runs these linting checks before each
commit. Enable this hook by running the `prepare` script:

```shell
npm run prepare
```

Ensure your code builds correctly before submitting a pull request:

```shell
npm run build # Build all the packages in the workspace
npm run build -w @srgssr/your-element-name # Build a single page by name
```

Refer to our [Contribution Guide](CONTRIBUTING.md) for more detailed information.

## Licensing

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more details.

[token-settings]: https://github.com/settings/tokens
[token-guide]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token
