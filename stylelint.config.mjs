import rationalOrder from 'stylelint-config-rational-order/config/configCreator.js';
import specialProperties from 'stylelint-config-rational-order/groups/special.js';

/**
 * `stylelint-config-rational-order` is unmaintained and can no longer be
 * extended: its bundled plugin relies on APIs that were removed in
 * stylelint 18. Only its property groups are reused here, the order itself is
 * enforced by `stylelint-order`.
 *
 * @type {import('stylelint').Config}
 */
export default {
  extends: ['stylelint-config-recommended-scss'],
  plugins: ['stylelint-order', 'stylelint-no-unsupported-browser-features'],
  rules: {
    'order/properties-order': [rationalOrder()],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: specialProperties
      }
    ],
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignore: ['css-nesting']
      }
    ]
  },
  overrides: [
    {
      files: ['packages/*/scss/_preset.scss'],
      rules: {
        'scss/at-extend-no-missing-placeholder': null
      }
    },
    {
      files: [
        'packages/srg-ssr-theme/scss/_icons.scss',
        'packages/srg-ssr-theme/scss/components/**/*.scss'
      ],
      rules: {
        'nesting-selector-no-missing-scoping-root': null,
        'font-family-no-missing-generic-family-keyword': null
      }
    }
  ]
};
