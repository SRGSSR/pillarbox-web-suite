export default function(plop) {
  plop.setGenerator('plugin', {
    description: 'Create a new plugin',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'What is the name of your plugin?',
    }],
    actions: [
      {
        type: 'addMany',
        destination: '../plugins/{{kebabCase name}}',
        base: './plugin-template',
        templateFiles: './plugin-template/**/*',
        globOptions: {
          dot: true  // Ensures files starting with a dot are included
        }
      }
    ]
  });
}
