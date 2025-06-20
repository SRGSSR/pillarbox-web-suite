## [@srgssr/user-preferences-v2.0.0](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/user-preferences-v1.1.1...@srgssr/user-preferences-v2.0.0) (2025-05-26)


### ⚠ BREAKING CHANGES

* **user-preferences:** the `restoreUserPreference` method has been renamed to
`restore`. The signatures of the `restoreAudioTrack` and `restoreTextTrack`
methods have changed to take the expected object as a parameter instead of the
object containing all preferences.

### New Features 🚀

* **user-preferences:** add control over saved/restored properties ([60fc9bd](https://github.com/SRGSSR/pillarbox-web-suite/commit/60fc9bdd94d47b55c725a90d95902f8d8bea8f4e)), closes [#43](https://github.com/SRGSSR/pillarbox-web-suite/issues/43)


### Chore 🧹

* use camel case for examples and documentation ([dbfa4fc](https://github.com/SRGSSR/pillarbox-web-suite/commit/dbfa4fc146b6037b8c761ca72dd9bad2e2ac9af1))

## [@srgssr/user-preferences-v1.1.1](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/user-preferences-v1.1.0...@srgssr/user-preferences-v1.1.1) (2025-05-02)


### Enhancements and Bug Fixes 🐛

* **user-preferences:** align browser compatibility with bable for the umd build ([717e05f](https://github.com/SRGSSR/pillarbox-web-suite/commit/717e05f01249235cdd405f7f078b07fb201992e9))

## [@srgssr/user-preferences-v1.1.0](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/user-preferences-v1.0.0...@srgssr/user-preferences-v1.1.0) (2025-05-01)


### New Features 🚀

* **user-preferences:** add UMD build configuration ([8678d23](https://github.com/SRGSSR/pillarbox-web-suite/commit/8678d230d2643663e6e78ede6dfc269cfcca0fd6))


### Chore 🧹

* **user-preferences:** remove unused scss file ([e064b1b](https://github.com/SRGSSR/pillarbox-web-suite/commit/e064b1bdb3e3ea131a17ba0557610222c22512a3))

## @srgssr/user-preferences-v1.0.0 (2025-04-30)


### Enhancements and Bug Fixes 🐛

* **user-preferences:** failed build step when the SCSS folder and file are missing ([fd4ca57](https://github.com/SRGSSR/pillarbox-web-suite/commit/fd4ca5743bc7c6a06196c7b1cc643e71b58a26f0))


### New Features 🚀

* add UserPreferences component ([90df75e](https://github.com/SRGSSR/pillarbox-web-suite/commit/90df75eb8b04ba98d304b41f39b98119bf7c28ee)), closes [#39](https://github.com/SRGSSR/pillarbox-web-suite/issues/39)
