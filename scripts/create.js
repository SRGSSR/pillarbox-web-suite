// eslint-disable-next-line max-lines-per-function
export default function(plop) {
  // Register an equality helper
  plop.setHelper('ifEq', function(a, b, options) {
    return (a === b) ? options.fn(this) : options.inverse(this);
  });

  const isTheme = data => data.type === 'Theme';

  // Template files left out of the generated element.
  const ignoredTemplates = data => [
    ...(!data.wantLocalization ? [
      '**/src/lang/**',
      '**/test/language.spec.js.hbs'
    ] : []),
    ...(!data.wantScss ? [
      '**/scss/**'
    ] : []),
    ...(!isTheme(data) ? [
      '**/scss/_preset.scss.hbs',
      '**/scss/_variables.scss.hbs',
      '**/scss/components/**',
      '**/src/player-options.js'
    ] : [])
  ];

  plop.setGenerator('plugin', {
    description: 'Create a new Pillarbox elemet',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'What type of element would you like to create?',
        choices: [
          { name: 'Plugin \x1b[90m(Extend the player functionality or add new features)\x1b[0m', value: 'Plugin' },
          { name: 'Component \x1b[90m(Manipulate or display content within the player)\x1b[0m', value: 'Component' },
          { name: 'Button \x1b[90m(Provide custom interactive functionality to the player)\x1b[0m', value: 'Button' },
          { name: 'Theme \x1b[90m(Restyle the whole player and override its default options)\x1b[0m', value: 'Theme' }
        ]
      },
      {
        type: 'list',
        name: 'platform',
        message: 'Which platform are you targeting?',
        choices: [
          { name: 'Pillarbox \x1b[90m(Contains business logic linked to SRG SSR media content)\x1b[0m', value: 'pillarbox' },
          { name: 'Video.js \x1b[90m(Standard video.js without specific business logic)\x1b[0m', value: 'videojs' }
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
        when: data => !isTheme(data),
        default: true
      },
      {
        type: 'confirm',
        name: 'wantScss',
        message: 'Will your element offer custom styles with SCSS?',
        when: data => !isTheme(data),
        default: true
      }
    ],
    actions: data => {
      // A theme always has styles and no localization, the corresponding
      // prompts are skipped and their answers set here.
      if (isTheme(data)) {
        Object.assign(data, { wantLocalization: false, wantScss: true });
      }

      return [
        {
          type: 'addMany',
          destination: '../packages/{{kebabCase name}}',
          base: './template',
          templateFiles: './template/**',
          globOptions: {
            dot: true,
            ignore: ignoredTemplates(data)
          },
          data: {
            currentYear: new Date().getFullYear(),
            importAlias: data.platform === 'pillarbox' ? '@srgssr/pillarbox-web' : 'video.js'
          }
        }
      ];
    }
  });
}
