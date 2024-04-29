# Pillarbox Web Suite

![Pillarbox logo](README-images/logo.jpg)

This repository is a comprehensive suite of plugins, themes, and components designed to boost the
experience of the [pillarbox-web](https://github.com/SRGSSR/pillarbox-web) player.

These tools provide versatile options for customization and enhancement tailored to meet your needs.

## Requirements

To use the components in this suite, you need the following installed on your system:

- Node.js

## Quick Start

To get started with this suite, follow these steps:

Add the `@srgssr` registry to your `.npmrc` file:

```plaintext
//npm.pkg.github.com/:_authToken=TOKEN
@srgssr:registry=https://npm.pkg.github.com
```

Generate a personal access token on the [Personal Access Tokens page][token-settings]. For more
information on using tokens with GitHub packages,
visit: [Authenticating with a Personal Access Token][token-guide].

Clone this repository:

```shell
git clone https://github.com/SRGSSR/pillarbox-web-suite.git
```

Install the dependencies:

```shell
npm install
```

### Adding a new plugin

Open your terminal and execute the following command:

```bash
npm run create
```

After running the command, you will be prompted to enter the name of your plugin. A new plugin
directory will be generated in the monorepo with the following structure:

```
/plugins/your-plugin-name
|-- src
|   `-- your-plugin-name.js       # Main JavaScript file for the plugin
|-- test
|   `-- your-plugin-name.test.js  # Jest tests for your plugin
|-- .babelrc                      # Babel configuration specific to this plugin
|-- index.html                    # Demo page to showcase the plugin
|-- jest.config.js                # Jest configuration specific to this plugin
|-- package.json                  # NPM package file, you might need to install additional dependencies
|-- README.md                     # Documentation file for the plugin
`-- rollup.config.js              # Rollup configuration for building the plugin
```

After the structure is generated, navigate into the plugin's directory:

```bash
cd plugins/your-plugin-name
```

The README.md file included in your plugin's directory provides detailed instructions on building
and testing the plugin.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow the project's code style and
linting rules. Here
are some commands to help you get started:

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
commit. Enable this
hook by running the `prepare` script:

```shell
npm run prepare
```

Ensure your code builds correctly before submitting a pull request:

```shell
npm run build -ws # Build all the packages in the workspace
npm run build -w @srgssr/your-plugin-name # Build a single page by name
```

Refer to our [Contribution Guide](CONTRIBUTING.md) for more detailed information.

## Licensing

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more details.

[token-settings]: https://github.com/settings/tokens

[token-guide]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token
