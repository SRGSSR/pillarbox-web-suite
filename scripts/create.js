// eslint-disable-next-line max-lines-per-function
export default function(plop) {
  // Register an equality helper
  plop.setHelper('ifEq', function(a, b, options) {
    return (a === b) ? options.fn(this) : options.inverse(this);
  });

  plop.setGenerator('plugin', {
    description: 'Create a new Pillarbox elemet',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'What type of the element would you like to create?',
        choices: [
          { name: 'Plugin \x1b[90m(Extend Pillarbox functionality or add new features)\x1b[0m', value: 'Plugin' },
          { name: 'Component \x1b[90m(Manipulate or display content within the player)\x1b[0m', value: 'Component' },
          { name: 'Button \x1b[90m(Provide custom interactive functionality to the player)\x1b[0m', value: 'Button' }
        ]
      },
      {
        type: 'input',
        name: 'name',
        message: data => `What is the name of your ${data.type}?`
      },
      {
        type: 'confirm',
        name: 'wantLocalization',
        message: 'Will your element support multiple languages?'
      }
    ],
    actions: data => [
      {
        type: 'addMany',
        destination: '../plugins/{{kebabCase name}}',
        base: './template',
        templateFiles: './template/**',
        globOptions: {
          dot: true,
          ignore: !data.wantLocalization ? '**/src/lang/**' : undefined
        }
      }
    ]
  });
}
