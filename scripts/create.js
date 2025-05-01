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
        name: 'platform',
        message: 'Which platform are you targeting?',
        choices: [
          { name: 'Pillarbox \x1b[90m(Contains business logic linked to SRG SSR media content)\x1b[0m', value: 'pillarbox' },
          { name: 'Video.js \x1b[90m(Standard video.js element without specific business logic)\x1b[0m', value: 'videojs' }
        ]
      },
      {
        type: 'list',
        name: 'type',
        message: 'What type of element would you like to create?',
        choices: [
          { name: 'Plugin \x1b[90m(Extend the player functionality or add new features)\x1b[0m', value: 'Plugin' },
          { name: 'Component \x1b[90m(Manipulate or display content within the player)\x1b[0m', value: 'Component' },
          { name: 'Button \x1b[90m(Provide custom interactive functionality to the player)\x1b[0m', value: 'Button' }
        ]
      },
      {
        type: 'input',
        name: 'name',
        message: data => `What is the name of your ${data.type}?`,
        validate: (value) => {
          if ((/.+/).test(value)) { return true; }

          return 'Package name is required';
        }
      },
      {
        type: 'confirm',
        name: 'wantLocalization',
        message: 'Will your element support multiple languages?',
        default: true
      },
      {
        type: 'confirm',
        name: 'wantScss',
        message: 'Will your element offer custom styles with SCSS?',
        default: true
      }
    ],
    actions: data => [
      {
        type: 'addMany',
        destination: '../packages/{{kebabCase name}}',
        base: './template',
        templateFiles: './template/**',
        globOptions: {
          dot: true,
          ignore: [
            ...(!data.wantLocalization ? [
              '**/src/lang/**',
              '**/test/language.spec.js.hbs'
            ] : []),
            ...(!data.wantScss ? [
              '**/scss/**'
            ] : [])
          ]
        },
        data: {
          currentYear: new Date().getFullYear(),
          importAlias: data.platform === 'pillarbox' ? '@srgssr/pillarbox-web' : 'video.js'
        }
      }
    ]
  });
}
