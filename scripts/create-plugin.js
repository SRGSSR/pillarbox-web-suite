export default function(plop) {
  plop.setGenerator('plugin', {
    description: 'Create a new plugin',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'What is the name of your plugin?',
    }, {
      type: 'confirm',
      name: 'wantLocalization',
      message: 'Will your plugin support multiple languages?',
    }],
    actions: data => [
      {
        type: 'addMany',
        destination: '../plugins/{{kebabCase name}}',
        base: './plugin-template',
        templateFiles: './plugin-template/**',
        globOptions: {
          dot: true,
          ignore: !data.wantLocalization ? '**/src/lang/**' : undefined
        }
      }
    ]
  });
}
